import * as React from "react";
import { cn } from "../../lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const inputVariants = cva(
	"w-full rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-transparent",
	{
		variants: {
			variant: {
				default:
					"border-input bg-background text-foreground px-4 py-2 placeholder:text-gray-400 focus-visible:border-accent focus-visible:ring-accent",
				secondary:
					"border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-accent",
				accent:
					"border-accent bg-accent text-accent-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-accent",
				primary:
					"w-full border-none text-lg font-semibold placeholder:text-gray-400 placeholder:font-semibold focus-visible:outline-none",
			},
			size: {
				default: "p-0",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
			},
		},
	},
);

function Input({
	className,
	variant,
	type,
	...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(inputVariants({ variant, className }))}
			{...props}
		/>
	);
}

export { Input };
