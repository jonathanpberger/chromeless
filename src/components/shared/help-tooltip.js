/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import Tooltip from '@mui/material/Tooltip';
import { withStyles } from '@mui/material/styles';

const HelpTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    maxWidth: 360,
  },
}))(Tooltip);

export default HelpTooltip;
