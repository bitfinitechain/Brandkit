// Public surface of @bitfinitechain/brandkit.
//
// One entry point rather than deep paths, so an app writes
//   import { Wordmark, Stat } from '@bitfinitechain/brandkit';
// and the package can move files around without breaking every consumer.
//
// CSS is NOT imported here. A component's styles ship as a stylesheet the app
// imports once from its own globals (`@import "@bitfinitechain/brandkit/styles.css"`),
// because bundling CSS into a JS import order that four different apps control
// is how you get a component whose styles win in one app and lose in another.
export { Wordmark } from './wordmark';
export { Stat, StatGrid } from './stat';
export { ThemeToggle, type ThemeToggleProps } from './theme-toggle';
export { AppHeader, type AppHeaderProps } from './app-header';
export { SocialLinks, BFX_SOCIALS, type SocialLinksProps, type SocialKey } from './social-links';
export { Footer, type FooterProps, type FooterColumn, type FooterLink } from './footer';
// ThemeProvider is NOT here on purpose — it imports next-themes, which analytics
// does not have. Subpath: '@bitfinitechain/brandkit/ui/theme-provider'.
export { Button, buttonVariants } from './button';
export { Badge, badgeVariants } from './badge';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
export { Input } from './input';
export { Select } from './select';
export { DataTable, DataRow, DataEmpty } from './data-table';
export { Pagination, paginationRange, type PaginationProps } from './pagination';
export { EmptyState, type EmptyStateProps } from './empty-state';
export { CopyField, type CopyFieldProps } from './copy-field';
// Charts. `chartToneClass` and `ChartTone` live in sparkline.tsx because that is
// the smallest of them; every other chart imports the tone map from there rather
// than each declaring its own idea of what "warn" looks like.
export { Sparkline, chartToneClass, type SparklineProps, type ChartTone } from './sparkline';
export { Gauge, type GaugeProps } from './gauge';
export { Donut, type DonutProps, type DonutSegment } from './donut';
export { BarChart, type BarChartProps, type BarDatum } from './bar-chart';
export { LineChart, type LineChartProps, type LinePoint } from './line-chart';
export { smoothPath } from './lib/smooth-path';
export { Sidebar, type SidebarProps, type SidebarGroup, type SidebarItem } from './sidebar';
export { cn } from './lib/cn';

// ---- primitives added to close the gap with shadcn -----------------------
// Ordered as the docs order them, so the two lists can be read side by side.
export { Alert, AlertTitle, AlertDescription, alertVariants, type AlertProps } from './alert';
export { Avatar, type AvatarProps } from './avatar';
export { Checkbox, type CheckboxProps } from './checkbox';
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';
export { Kbd } from './kbd';
export { Label } from './label';
export {
    Popover, PopoverTrigger, PopoverContent, PopoverAnchor,
    PopoverHeader, PopoverTitle, PopoverDescription,
} from './popover';
export { Progress, type ProgressProps } from './progress';
export { Separator, type SeparatorProps } from './separator';
export { Skeleton, SkeletonText, type SkeletonProps } from './skeleton';
export { Spinner, type SpinnerProps } from './spinner';
export { Switch, type SwitchProps } from './switch';
export { Textarea } from './textarea';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';

// ---- the rest of the shadcn set ------------------------------------------
// The chat primitives (Attachment, Bubble, Marker, Message, Message Scroller,
// Questionnaire) are deliberately absent: they are for an assistant UI and
// nothing in BFX is one.
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';
export {
    AlertDialog, AlertDialogTrigger, AlertDialogPortal, AlertDialogOverlay, AlertDialogContent,
    AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription,
    AlertDialogAction, AlertDialogCancel,
} from './alert-dialog';
export { AspectRatio } from './aspect-ratio';
export {
    Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage,
    BreadcrumbSeparator, BreadcrumbEllipsis,
} from './breadcrumb';
export { ButtonGroup, ButtonGroupText, buttonGroupVariants, type ButtonGroupProps } from './button-group';
export { Calendar, type CalendarProps } from './calendar';
export {
    Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext,
    type CarouselProps, type CarouselApi,
} from './carousel';
export {
    ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent,
    ChartLegend, ChartLegendContent, useChart, type ChartConfig,
} from './chart';
export { Combobox, type ComboboxProps, type ComboboxOption } from './combobox';
export {
    Command, CommandDialog, CommandInput, CommandList, CommandEmpty,
    CommandGroup, CommandItem, CommandSeparator, CommandShortcut,
} from './command';
export {
    ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem,
    ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut,
    ContextMenuGroup, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup,
} from './context-menu';
export { DatePicker, type DatePickerProps } from './date-picker';
export {
    Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger,
    DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
} from './dialog';
export { DirectionProvider } from './direction';
export {
    Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose,
    DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription,
} from './drawer';
export {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub,
    DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup,
} from './dropdown-menu';
export { Field, type FieldProps } from './field';
export { HoverCard, HoverCardTrigger, HoverCardContent } from './hover-card';
export { InputGroup, InputGroupAddon } from './input-group';
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './input-otp';
export { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from './item';
export {
    Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarCheckboxItem,
    MenubarRadioItem, MenubarLabel, MenubarSeparator, MenubarShortcut, MenubarGroup,
    MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarRadioGroup,
} from './menubar';
export { NativeSelect } from './native-select';
export {
    NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger,
    NavigationMenuContent, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from './navigation-menu';
export { RadioGroup, RadioGroupItem } from './radio-group';
export { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './resizable';
export { ScrollArea, ScrollBar } from './scroll-area';
export {
    Sheet, SheetTrigger, SheetClose, SheetPortal, SheetContent,
    SheetHeader, SheetFooter, SheetTitle, SheetDescription,
} from './sheet';
export { Slider } from './slider';
export { Toaster, toast } from './sonner';
export {
    Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption,
} from './table';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
export { Toggle, toggleVariants, type ToggleProps } from './toggle';
export { ToggleGroup, ToggleGroupItem } from './toggle-group';
export { Prose } from './typography';
