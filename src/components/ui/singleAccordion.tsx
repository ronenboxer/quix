import { useSvg } from "@/components/shared/useSvg"
import { Box, IconButton, SxProps, Theme, styled } from "@mui/material"
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import ArrowRight from '@mui/icons-material/ArrowRight'

interface SingleAccordionProps {
    isExpanded: boolean
    id: string
    onToggleExpand: (id: string) => void
    accordionStyle?: SxProps<Theme>
    summaryProps?: AccordionSummaryProps
    detailsProps?: SingleAccordionProps
    summary: JSX.Element | string
    details: JSX.Element | string
}

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowRight />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor: '#ececec',
    justifyContent: 'space-between',
    '& .MuiAccordionSummary-expandIconWrapper': {
        color: 'inherit'
    },
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}))

export default function SingleAccordion(props: SingleAccordionProps) {
    const { isExpanded, id, onToggleExpand, accordionStyle = {}, summaryProps = {}, detailsProps = {}, summary, details } = props


    function toggleExpandHandler() { onToggleExpand(id) }

    return (
        <Accordion expanded={isExpanded} onChange={toggleExpandHandler} sx={accordionStyle}>
            <AccordionSummary aria-controls={id + '-content'} id={id + '-header'} {...summaryProps}>
                {/* <Typography>Collapsible Group Item #1</Typography> */}
                {summary}
            </AccordionSummary>
            <AccordionDetails {...detailsProps}>
                {details}
                {/* <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                            sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget.
                        </Typography> */}
            </AccordionDetails>
        </Accordion>
    )
}