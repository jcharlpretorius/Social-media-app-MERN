import { Box } from "@mui/material";
import { styled } from "@mui/system";

// allows us to reuse this set of css properties
// style component
const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
})

export default FlexBetween;