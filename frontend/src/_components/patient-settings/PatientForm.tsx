import type { Patient } from "@b/drizzle/schema/schema";
import {
	DialogHeader,
	DialogTitle,
	Dialog,
	DialogContent,
} from "@f/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Label } from "@f/components/ui/label";
import { Input } from "@f/components/ui/input";
import { Button } from "@f/components/ui/button";
import { Loader2 } from "lucide-react";
import { LoadingState } from "@f/app/n4d/patients/page";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@f/components/ui/select";

const genderEnum = z.enum(["male", "female"]);

const patientSchema = z.object({
	firstName: z
		.string()
		.min(3, "First name must be ≥ 3 characters")
		.max(100, "First name must be ≤ 100 characters"),
	lastName: z
		.string()
		.min(3, "Last name must be ≥ 3 characters")
		.max(100, "Last name must be ≤ 100 characters"),
	dob: z
		.string()
		.refine((d) => !isNaN(Date.parse(d)), "Date of birth must be a valid date"),
	gender: genderEnum,
});

export type PatientSchemaType = z.infer<typeof patientSchema>;

interface PatientFormDialogProps {
	open: boolean;
	mode: "edit" | "create";
	patient?: Patient;
	onSubmit: (p: PatientSchemaType) => void;
	onCancel: () => void;
	OpenChange: () => void;
	loading: LoadingState;
}

const PatientFormDialog: React.FC<PatientFormDialogProps> = ({
	mode,
	patient,
	onSubmit,
	onCancel,
	loading,
}) => {
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<PatientSchemaType>({
		resolver: zodResolver(patientSchema),
		defaultValues: patient
			? {
					firstName: patient.firstName || "",
					lastName: patient.lastName || "",
					dob: patient.dob || "",
					gender: patient.gender as "male" | "female",
				}
			: {
					firstName: "",
					lastName: "",
					dob: "",
					gender: "male",
				},
	});

	return (
		<Dialog open>
			<DialogContent>
				<div className="space-y-4">
					<DialogHeader>
						<DialogTitle>
							{mode === "edit" ? "Edit Patient" : "New Patient"}
						</DialogTitle>
					</DialogHeader>
					<form
						onSubmit={handleSubmit((data) => onSubmit(data))}
						className="space-y-4"
					>
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name</Label>
							<div>
								<Input
									variant="default"
									{...register("firstName")}
									placeholder="First name"
								/>
								{errors.firstName && (
									<span className="text-red-600 text-xs">
										{errors.firstName.message}
									</span>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name</Label>
							<div>
								<Input
									variant="default"
									{...register("lastName")}
									placeholder="Last name"
								/>
								{errors.lastName && (
									<span className="text-red-600 text-xs">
										{errors.lastName.message}
									</span>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="dob">Date of Birth</Label>
							<div>
								<Input
									type="date"
									variant="default"
									{...register("dob")}
									placeholder="Date of birth"
									max={new Date().toISOString().split("T")[0]}
								/>
								{errors.dob && (
									<span className="text-red-600 text-xs">
										{errors.dob.message}
									</span>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="dateOfBirth">Gender</Label>
							<Controller
								name="gender"
								control={control}
								rules={{ required: "Gender is required" }}
								render={({ field }) => (
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Gender" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="male">Male</SelectItem>
											<SelectItem value="female">Female</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							{errors.gender && (
								<span className="text-red-600 text-xs">
									{errors.gender.message}
								</span>
							)}
						</div>
						<div className="flex justify-end gap-2">
							<Button variant="secondary" onClick={onCancel}>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="primary"
								disabled={loading === "save"}
							>
								{loading === "save" ? (
									<Loader2 className="w-4 h-4 animate-spin text-black" />
								) : (
									<span>{mode === "edit" ? "Update" : "Save"}</span>
								)}
							</Button>
						</div>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default PatientFormDialog;
