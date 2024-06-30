
import { Box } from "@mui/material";
import type { Metadata } from 'next'
import { PageHeader } from "../../../../../components/nav/pageHeader";
import { pageContainer } from "../../../../../components/styyle";
import LeaveReports from "../../reports";

export const metadata: Metadata = {
    title: {
        default: `Leave Application System`,
        template: ` %s `
    },
    description: `Register for free and manage your organisations leave applications seamlessly `,
}

export default function Page() {

    return (
        <Box
            id="image"
            sx={pageContainer}
        >
            <Box sx={{ marginBottom: "3vh" }} >
                <PageHeader message="Leave Applications Report" />
            </Box>

            <Box >
                <LeaveReports />
            </Box>
        </Box>
    )

}