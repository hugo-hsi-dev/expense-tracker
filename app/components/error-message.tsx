import type { PropsWithChildren } from "react";
import { cn } from "~/lib/cn";

type ErrorMessageProps = PropsWithChildren;

export default function ErrorMessage({ children }: ErrorMessageProps) {
	return (
		<div className={cn("validator-hint text-error", children && "!visible")}>
			{children ? children : <span className="invisible"> - </span>}
		</div>
	);
}
