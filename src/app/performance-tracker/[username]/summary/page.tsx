import { Box } from "@mui/material";
import type { Metadata } from 'next'
import Reports from "./reports";
import { PageHeader } from "../../../../../components/nav/pageHeader";
import { siteTitle, pageContainer } from "../../../../../components/styyle";

export const metadata: Metadata = {
    title: {
        default: `${siteTitle} - Performance Tracker Summary`,
        template: ` %s `
    },
    description: `Manage employee leave applications , track performances and keep track of time being spent on various company projects for free`,
}
export default function Page() {

    return (
        <Box sx={pageContainer}>
            <PageHeader message="Performance Summary" />
            <Box sx={{ marginTop: "3vh" }} >
                <Reports />
            </Box>
        </Box>
    )

}