import { useSnackbar } from 'notistack';

/** Lightweight toast helpers — requires SnackbarProvider in _app.tsx */
export const useToast = () => {
	const { enqueueSnackbar } = useSnackbar();

	return {
		success: (message: string) => enqueueSnackbar(message, { variant: 'success' }),
		error: (message: string) => enqueueSnackbar(message, { variant: 'error' }),
		info: (message: string) => enqueueSnackbar(message, { variant: 'info' }),
		warning: (message: string) => enqueueSnackbar(message, { variant: 'warning' }),
	};
};
