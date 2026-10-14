import { createTheme, type Theme } from '@mui/material/styles';

/**
 * The site-wide MUI theme still carries the legacy red primary; the admin panel
 * re-skins MUI with the Velora palette without touching public pages.
 * Every palette key is spelled out because createTheme(outer, …) deep-merges and
 * would otherwise keep the outer theme's derived light/dark shades.
 */
export const veloraAdminTheme = (outer: Theme): Theme =>
	createTheme(outer, {
		palette: {
			primary: { main: '#5b3df5', light: '#7d66f7', dark: '#4527db', contrastText: '#ffffff' },
			secondary: { main: '#ff6b2c', light: '#ff8c5a', dark: '#e0551a', contrastText: '#ffffff' },
			background: { default: '#f5f7fb', paper: '#ffffff' },
			text: { primary: '#181a20', secondary: '#5d6275' },
		},
		shape: { borderRadius: 10 },
		typography: { fontFamily: "'Poppins', sans-serif" },
		components: {
			MuiButton: {
				defaultProps: { disableElevation: true },
				styleOverrides: { root: { textTransform: 'none', fontWeight: 600, borderRadius: 10 } },
			},
			MuiDialog: { styleOverrides: { paper: { borderRadius: 16 } } },
			// The site theme forces every FormControl to width: 100%; admin toolbars need intrinsic widths.
			MuiFormControl: { styleOverrides: { root: { width: 'auto' } } },
			MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 10, background: '#fff' } } },
			MuiTableCell: { styleOverrides: { root: { borderColor: '#eef0f6' } } },
		},
	});
