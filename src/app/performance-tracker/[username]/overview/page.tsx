import { Box } from "@mui/material";
import type { Metadata } from 'next'
import { PageHeader } from "../../../../../components/nav/pageHeader";
import { siteTitle, pageContainer } from "../../../../../components/styyle";
import Overview from "./overview";

export const metadata: Metadata = {
    title: {
        default: `${siteTitle} - Performance Overview`,
        template: ` %s `
    },
    description: `Manage employee leave applications , track performances and keep track of time being spent on various company projects for free`,
}
export default function Page() {

    return (
        <Box sx={pageContainer}>
            <PageHeader message="Performance Overview" />
            <Box sx={{ marginTop: "3vh" }} >
                <Overview />
            </Box>
        </Box>
    )

}