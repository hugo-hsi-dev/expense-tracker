import { useFetcher } from "react-router";
import type { MonthAndYear } from "~/features/history/schemas/months-and-year.type";
import type { loader } from "~/routes/_auth.get-payments";

type SelectMonthFormProps = {
	monthsWithData: MonthAndYear[];
};

export default function SelectMonthForm({
	monthsWithData,
}: SelectMonthFormProps) {
	const fetcher = useFetcher<typeof loader>({
		key: SelectMonthForm.fetcherKey,
	});

	const currentDate = new Date();
	const defaultValue = JSON.stringify({
		month: currentDate.getMonth(),
		year: currentDate.getFullYear(),
	});

	if (monthsWithData.length === 0) {
		return (
			<button className="btn" type="button">
				Current
			</button>
		);
	}

	return (
		<fetcher.Form method="GET" action="/get-payments">
			<input type="hidden" name="intent" value={SelectMonthForm.intent} />
			<select
				defaultValue={defaultValue}
				className="select"
				name="monthAndYear"
				onChange={(event) => {
					fetcher.submit(event.currentTarget.form);
				}}
			>
				<option disabled={true}>Pick a month</option>
				{monthsWithData[0].month !== currentDate.getMonth() + 1 &&
					monthsWithData[0].year !== currentDate.getFullYear() && (
						<option
							value={JSON.stringify({
								month: currentDate.getMonth(),
								year: currentDate.getFullYear(),
							})}
						>
							Current
						</option>
					)}
				{monthsWithData.map(({ month, year }) => {
					let display: string;

					if (
						month === currentDate.getMonth() + 1 &&
						year === currentDate.getFullYear()
					) {
						display = "Current";
					} else {
						display = `${month}/${year}`;
					}

					return (
						<option value={JSON.stringify({ month, year })} key={month + year}>
							{display}
						</option>
					);
				})}
			</select>
		</fetcher.Form>
	);
}

SelectMonthForm.intent = "select-month";
SelectMonthForm.fetcherKey = "select-month";
