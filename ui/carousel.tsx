'use client';

import * as React from 'react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from './lib/cn';
import { Button } from './button';

/** A slider of panels. Adapted from shadcn/ui (MIT), on embla. */
type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];
type CarouselPlugin = Parameters<typeof useEmblaCarousel>[1];

interface CarouselContextValue {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0];
    api: CarouselApi;
    orientation: 'horizontal' | 'vertical';
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
    const ctx = React.useContext(CarouselContext);
    if (!ctx) throw new Error('Carousel parts must be used inside <Carousel>');
    return ctx;
}

export interface CarouselProps extends React.ComponentProps<'div'> {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: 'horizontal' | 'vertical';
    setApi?: (api: CarouselApi) => void;
}

export function Carousel({
    orientation = 'horizontal', opts, setApi, plugins, className, children, ...props
}: CarouselProps) {
    const [carouselRef, api] = useEmblaCarousel({ ...opts, axis: orientation === 'horizontal' ? 'x' : 'y' }, plugins);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((a: CarouselApi) => {
        if (!a) return;
        setCanScrollPrev(a.canScrollPrev());
        setCanScrollNext(a.canScrollNext());
    }, []);

    React.useEffect(() => { if (api && setApi) setApi(api); }, [api, setApi]);
    React.useEffect(() => {
        if (!api) return;
        onSelect(api);
        api.on('reInit', onSelect).on('select', onSelect);
        return () => { api.off('select', onSelect); };
    }, [api, onSelect]);

    const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

    return (
        <CarouselContext.Provider value={{ carouselRef, api, orientation, scrollPrev, scrollNext, canScrollPrev, canScrollNext }}>
            {/* A region with a name, and arrow keys, because a carousel that only
                responds to a drag is unreachable from a keyboard. */}
            <div
                onKeyDownCapture={(e) => {
                    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollPrev(); }
                    else if (e.key === 'ArrowRight') { e.preventDefault(); scrollNext(); }
                }}
                className={cn('relative', className)}
                role="region"
                aria-roledescription="carousel"
                data-slot="carousel"
                {...props}
            >
                {children}
            </div>
        </CarouselContext.Provider>
    );
}

export function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
    const { carouselRef, orientation } = useCarousel();
    return (
        <div ref={carouselRef} className="overflow-hidden" data-slot="carousel-content">
            <div className={cn('flex', orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', className)} {...props} />
        </div>
    );
}

export function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
    const { orientation } = useCarousel();
    return (
        <div role="group" aria-roledescription="slide" data-slot="carousel-item"
             className={cn('min-w-0 shrink-0 grow-0 basis-full', orientation === 'horizontal' ? 'pl-4' : 'pt-4', className)}
             {...props} />
    );
}

export function CarouselPrevious({ className, ...props }: React.ComponentProps<typeof Button>) {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    return (
        <Button variant="outline" size="icon" disabled={!canScrollPrev} onClick={scrollPrev}
                className={cn('absolute size-8 rounded-full',
                              orientation === 'horizontal' ? '-left-12 top-1/2 -translate-y-1/2' : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
                              className)}
                {...props}>
            <ArrowLeft className="size-4" />
            <span className="sr-only">Previous slide</span>
        </Button>
    );
}

export function CarouselNext({ className, ...props }: React.ComponentProps<typeof Button>) {
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    return (
        <Button variant="outline" size="icon" disabled={!canScrollNext} onClick={scrollNext}
                className={cn('absolute size-8 rounded-full',
                              orientation === 'horizontal' ? '-right-12 top-1/2 -translate-y-1/2' : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
                              className)}
                {...props}>
            <ArrowRight className="size-4" />
            <span className="sr-only">Next slide</span>
        </Button>
    );
}

export type { CarouselApi };
