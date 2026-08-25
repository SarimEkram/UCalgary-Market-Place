import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomButton from "./CustomButton";

describe("CustomButton", () => {
    it("renders its children as the button label", () => {
        render(<CustomButton>Save</CustomButton>);
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("maps color='red' to the MUI 'primary' color", () => {
        render(<CustomButton color="red">Delete</CustomButton>);
        expect(screen.getByRole("button")).toHaveClass("MuiButton-containedPrimary");
    });

    it("maps any other color to the MUI 'secondary' color", () => {
        render(<CustomButton color="black">Cancel</CustomButton>);
        expect(screen.getByRole("button")).toHaveClass("MuiButton-containedSecondary");
    });

    it("calls onClick when clicked", async () => {
        const onClick = vi.fn();
        render(<CustomButton onClick={onClick}>Confirm</CustomButton>);
        await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("forwards a disabled prop", () => {
        render(<CustomButton disabled>Locked</CustomButton>);
        expect(screen.getByRole("button")).toBeDisabled();
    });
});
