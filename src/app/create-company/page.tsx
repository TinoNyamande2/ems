
import { Box ,Typography} from "@mui/material";
import type { Metadata } from 'next'
import { siteTitle, pageContainer } from "../../../components/styyle";
import { PageHeader } from "../../../components/nav/pageHeader";
import { AddCompany } from "./company";

export const metadata: Metadata = {
    title: {
        default: `${siteTitle} - Register your organisation`,
        template: ` %s `
    },
    description: `Register for free and manage your organisations leave applications seamlessly `,
}

export default function Page() {

    return (
        <Box id="image" sx={pageContainer}>
            <PageHeader message="Register Your Organisation" />
            <Box sx={{ marginTop: "3vh" }}>
                <Box sx={{ padding: "6" }}>
                    <Typography sx={{ textAlign: "center", fontSize: "1.4em", marginBottom: "4vh" }}>You dont appear to belong to any organisation</Typography>
                </Box>
                <AddCompany />
            </Box>
        </Box>
    )

}