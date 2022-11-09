import { extend, colord } from 'colord';
import { alpha } from '@mui/material/styles';
import mixPlugin from 'colord/plugins/mix';
import { toRem } from './Fonts';

extend([mixPlugin]);

const components = (theme) => {
  const buttonPrimaryHover = colord(theme.palette.primary.main)
    .mix(theme.palette.primary.contrastText, 0.12)
    .alpha(1)
    .toHslString();
  const buttonSecondaryHover = colord(theme.palette.secondary.main)
    .mix(theme.palette.secondary.contrastText, 0.12)
    .alpha(1)
    .toHslString();

  const fabBackgroundColor =
    theme.palette.mode === 'dark'
      ? colord(theme.palette.background.default)
          .mix(theme.palette.action.selected, 0.24)
          .alpha(1)
          .toHslString()
      : theme.palette.background.paper;

  const transitionEasingStrong = 'cubic-bezier(0.85, 0, 0, 1)'; // https://docs.microsoft.com/en-us/windows/apps/design/signature-experiences/motion#animation-properties

  return {
    transitions: {
      easing: { strong: transitionEasingStrong },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          // https://css-tricks.com/revisiting-prefers-reduced-motion-the-reduced-motion-media-query/
          '@media screen and (prefers-reduced-motion: reduce), (update: slow)': {
            '*:not(.MuiCircularProgress-root *):not(.MuiLinearProgress-root *)': {
              animationDuration: '0.001ms !important',
              animationIteratonCount: '1 !important',
              transitionDuration: '0.001ms !important',
              scrollBehavior: 'auto !important',
            },
          },

          body: { cursor: 'default' },

          '@supports selector(:has(a))': {
            body: {
              transition: 'background-color 0s',
              transitionDelay: `${theme.transitions.duration.leavingScreen}ms`,
            },

            '#root': {
              transformOrigin: `50% ${theme.spacing(1)}`,
              transition: theme.transitions.create(['transform', 'border-radius']),
              transitionDuration: `${theme.transitions.duration.leavingScreen}ms, 0s`,
              transitionDelay: `0s, ${theme.transitions.duration.leavingScreen}ms`,
            },
          },

          'code, pre, pre.MuiTypography-root': {
            fontFamily: theme.typography.fontFamilyMono,
            fontFeatureSettings: 'normal',
            letterSpacing: 0,

            backgroundColor: theme.palette.action.hover,
            borderRadius: theme.shape.borderRadius,
            padding: `${1 / 16}em ${4 / 16}em`,
          },
          'pre, pre.MuiTypography-root': {
            padding: `${4 / 16}em ${8 / 16}em`,
          },

          '.visually-hidden': {
            position: 'absolute',
            clip: 'rect(1px, 1px, 1px, 1px)',
            overflow: 'hidden',
            height: 1,
            width: 1,
            padding: 0,
            border: 0,
          },

          '.rcp': {
            backgroundColor: 'transparent',
            borderRadius: theme.shape.borderRadius * 2,
            border: `1px solid ${theme.palette.divider}`,
            boxSizing: 'border-box',

            '--rcp-background': 'transparent',
            '--rcp-input-text': theme.palette.text.primary,
            '--rcp-input-border': theme.palette.divider,
            '--rcp-input-label': theme.palette.text.primary,

            '& .rcp-saturation': {
              borderTopLeftRadius: theme.shape.borderRadius * 2 - 1,
              borderTopRightRadius: theme.shape.borderRadius * 2 - 1,
            },
            '& .rcp-body': {
              padding: theme.spacing(2),
            },
            '& .rcp-fields': {
              gridTemplateColumns: `repeat(auto-fit, minmax(${theme.spacing(20)}, 1fr))`,
            },
            '& .rcp-fields-element': {
              flexDirection: 'column-reverse',
              alignItems: 'flex-start',
              gap: theme.spacing(0.25),
            },
            '& .rcp-fields-element-label': {
              ...theme.typography.button,
              paddingLeft: theme.spacing(0.25),
            },
            '& .rcp-fields-element-input': {
              ...theme.typography.body2,
              textAlign: 'left',
              fontVariantNumeric: 'tabular-nums',

              backgroundColor: theme.palette.action.input,
              '&:hover:not(.Mui-disabled), &:focus': {
                backgroundColor: theme.palette.action.input,
              },

              border: 0,
              boxShadow: `0 -1px 0 0 ${theme.palette.text.disabled} inset,
                        0 0 0 1px ${theme.palette.action.inputOutline} inset`,
              transition: theme.transitions.create('box-shadow', {
                duration: theme.transitions.duration.short,
              }),

              '&:hover': {
                boxShadow: `0 -1px 0 0 ${theme.palette.text.primary} inset,
                          0 0 0 1px ${theme.palette.action.inputOutline} inset`,
              },
              '&:focus, &:focus:hover': {
                boxShadow: `0 -2px 0 0 ${theme.palette.primary.main} inset,
                          0 0 0 1px ${theme.palette.action.inputOutline} inset`,
              },

              borderRadius: theme.shape.borderRadius,
              padding: theme.spacing(0.75, 1.5),
              caretColor: theme.palette.primary.main,
            },
          },

          '.wmde-markdown.wmde-markdown, .wmde-markdown-var.wmde-markdown-var': {
            font: 'inherit',
            fontFeatureSettings: 'inherit',
            letterSpacing: 'inherit',
            backgroundColor: 'transparent',
            color: 'inherit',

            '--color-canvas-default': 'transparent',
            '--color-border-default': theme.palette.divider,
            '--color-border-muted': theme.palette.divider,

            '& .w-md-editor-text': { fontFeatureSettings: 'inherit' },

            '& .w-md-editor-text-pre > code': {
              font: 'inherit !important',
              fontFeatureSettings: 'inherit',
              letterSpacing: 'inherit',
              background: 'none',
            },
          },
        },
      },

      MuiContainer: {
        defaultProps: { maxWidth: 'xl' },
        styleOverrides: {
          root: {
            paddingLeft: `max(${theme.spacing(2)}, env(safe-area-inset-left))`,
            paddingRight: `max(${theme.spacing(2)}, env(safe-area-inset-right))`,
            [theme.breakpoints.up('sm')]: {
              paddingLeft: `max(${theme.spacing(3)}, env(safe-area-inset-left))`,
              paddingRight: `max(${theme.spacing(3)}, env(safe-area-inset-right))`,
            },

            marginBottom: `env(safe-area-inset-bottom)`,
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: { paddingBottom: 'env(safe-area-inset-bottom)' },
          paperAnchorLeft: { paddingLeft: 'env(safe-area-inset-left)' },
          paperAnchorRight: { paddingRight: 'env(safe-area-inset-right)' },
          paperAnchorTop: { paddingTop: 'env(safe-area-inset-top)' },
        },
      },

      MuiPaper: {
        styleOverrides: {
          rounded: { borderRadius: theme.shape.borderRadius * 2 },
        },
      },

      MuiDialog: {
        styleOverrides: {
          root: {
            '--dialog-title-height': '64px',
            [theme.breakpoints.down('sm')]: {
              '--dialog-title-height': '56px',
            },
          },

          paper: {
            borderRadius: theme.shape.borderRadius * 2,

            '--dialog-spacing': theme.spacing(3),
            [theme.breakpoints.down('sm')]: {
              '--dialog-spacing': theme.spacing(2.5),
            },
          },

          paperWidthXs: {
            [theme.breakpoints.up('sm')]: { maxWidth: 360 },
          },
          paperFullScreen: {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            marginTop: `calc(env(safe-area-inset-top) + ${theme.spacing(1)})`,
            maxHeight: `calc(100% - env(safe-area-inset-top) - ${theme.spacing(1)})`,
            maxWidth: '100% !important',
            paddingLeft: 'env(safe-area-inset-left)',
            paddingRight: 'env(safe-area-inset-right)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            padding: 'var(--dialog-spacing)',
            paddingTop: (64 - 28) / 2,
            paddingBottom: (64 - 28) / 2,

            [theme.breakpoints.down('sm')]: {
              paddingTop: (56 - 28) / 2,
              paddingBottom: (56 - 28) / 2,
            },
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            padding: theme.spacing(0, 'var(--dialog-spacing)', 1),
            '&:last-child': { paddingBottom: 'var(--dialog-spacing)' },

            '--dialog-contents-spacing': theme.spacing(3),
            '& > * + *': { marginTop: 'var(--dialog-contents-spacing)' },

            ...theme.typography.body2,
          },
        },
      },
      MuiDialogContentText: {
        defaultProps: {
          variant: 'body2',
          color: 'textPrimary',
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          spacing: {
            padding: theme.spacing(2),
            [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.5) },
          },
        },
      },

      MuiSnackbar: {
        styleOverrides: {
          root: {
            left: `max(${theme.spacing(1)}, env(safe-area-inset-left))`,
            bottom: `max(${theme.spacing(1)}, env(safe-area-inset-bottom))`,
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            borderRadius: theme.shape.borderRadius * 1.5,
            backgroundColor: theme.palette.secondary.main,
          },
        },
      },

      MuiTextField: {
        defaultProps: {
          variant: 'filled',
          size: 'small',
        },

        styleOverrides: {
          root: {
            '&.labelHorizontal': {
              flexDirection: 'row',
              alignItems: 'center',

              '& .MuiInputLabel-root': {
                padding: 0,
                paddingRight: theme.spacing(1),
              },
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            caretColor: theme.palette.primary.main,
            '.Mui-error &': { caretColor: theme.palette.error.main },
          },
          inputSizeSmall: theme.typography.body2,
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            backgroundColor: theme.palette.action.input,
            '&:hover:not(.Mui-disabled), &:focus, &.Mui-focused': {
              backgroundColor: theme.palette.action.input,
            },

            boxShadow: `0 -1px 0 0 ${theme.palette.text.disabled} inset,
                        0 0 0 1px ${theme.palette.action.inputOutline} inset`,
            transition: theme.transitions.create('box-shadow', {
              duration: theme.transitions.duration.short,
            }),

            '&:hover': {
              boxShadow: `0 -1px 0 0 ${theme.palette.text.primary} inset,
                          0 0 0 1px ${theme.palette.action.inputOutline} inset`,
            },
            '&.Mui-focused, &.Mui-focused:hover': {
              boxShadow: `0 -2px 0 0 ${theme.palette.primary.main} inset,
                          0 0 0 1px ${theme.palette.action.inputOutline} inset`,
            },
            '&.Mui-error, &.Mui-error:hover': {
              boxShadow: `0 -2px 0 0 ${theme.palette.error.main} inset,
                          0 0 0 1px ${theme.palette.action.inputOutline} inset`,
            },

            borderRadius: theme.shape.borderRadius,
            overflow: 'hidden',
            '&::before': { content: 'none' },
            '&::after': {
              width: `calc(100% - ${theme.shape.borderRadius * 2}px)`,
              left: theme.shape.borderRadius,
            },

            '&.Mui-disabled': {
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'transparent'
                  : theme.palette.action.disabledBackground,
            },
          },
          colorSecondary: {
            '&.Mui-focused::before, &.Mui-focused:hover::before': {
              borderColor: theme.palette.secondary.main,
            },
          },
          input: {
            paddingTop: theme.spacing(1.5),
            paddingBottom: theme.spacing(13 / 8),
            height: toRem(23),

            '.MuiInputBase-root .MuiFilledInput-input.MuiInputBase-input&::placeholder': {
              // https://github.com/mui-org/material-ui/blob/master/packages/mui-material/src/InputBase/InputBase.js#L136
              opacity: `${theme.palette.mode === 'light' ? 0.42 : 0.5} !important`,
            },
          },
          inputSizeSmall: {
            padding: theme.spacing(0.75, 1.5),
            height: toRem(20),
          },
          multiline: { padding: 0 },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            ...theme.typography.button,
            color: theme.palette.text.primary,
          },
          filled: {
            '&, &.MuiInputLabel-shrink': { transform: 'none' },

            position: 'static',
            padding: theme.spacing(2 / 8, 2 / 8),
            pointerEvents: 'auto',

            maxWidth: 'none',
            overflow: 'visible',
            whiteSpace: 'normal',
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            ...theme.typography.button,
            color: theme.palette.text.primary,
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          contained: {
            margin: theme.spacing(0.5, 2 / 8, 0),
          },
        },
      },

      MuiSelect: {
        styleOverrides: {
          select: {
            // If Select option is a MenuItem, don’t add spacing
            '& > *': {
              margin: 0,
              paddingTop: 0,
              paddingBottom: 0,
            },
          },
          icon: {
            transition: theme.transitions.create('transform', {
              duration: theme.transitions.duration.short,
            }),
          },
          iconOpen: { transform: 'rotate(180deg)' },
        },
      },
      MuiListItem: {
        defaultProps: { dense: true },
      },
      MuiListItemText: {
        defaultProps: {
          secondaryTypographyProps: { variant: 'caption' },
        },
        styleOverrides: {
          root: {
            '.MuiMenu-list &': { whiteSpace: 'normal' },
          },
          primary: {
            '.MuiSelect-select &': theme.typography.body2,
          },
          secondary: {
            '.MuiSelect-select &': { display: 'none' },
          },
        },
      },

      MuiMenu: {
        styleOverrides: {
          list: { padding: theme.spacing(0.5, 0) },
        },
      },
      MuiMenuItem: {
        defaultProps: { dense: true },
        styleOverrides: {
          root: {
            width: `calc(100% - ${theme.spacing(1)})`,
            margin: theme.spacing(0, 0.5),
            padding: theme.spacing(0.5, 1.5),
            minHeight: 32,
            borderRadius: theme.shape.borderRadius,

            '&.Mui-selected': {
              backgroundColor: theme.palette.action.selected,
              '&::before': {
                content: "''",
                display: 'block',
                position: 'absolute',
                top: (32 - 16) / 2,
                bottom: (32 - 16) / 2,
                left: 0,

                width: 3,
                borderRadius: 1.5,
                backgroundColor: theme.palette.primary.main,
              },
            },

            '& .MuiListItemIcon-root': {
              minWidth: 24 + 12,
              '& svg': { fontSize: toRem(24) },
            },

            '& + .MuiDivider-root': {
              marginTop: theme.spacing(0.5),
              marginBottom: theme.spacing(0.5),
            },
          },
        },

        variants: [
          {
            props: { color: 'error' },
            style: {
              color: theme.palette.error.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, theme.palette.action.hoverOpacity),
              },

              '& .MuiListItemIcon-root .MuiSvgIcon-root': {
                color: alpha(theme.palette.error.main, theme.palette.action.activeOpacity * 1.1),
              },
            },
          },
        ],
      },
      MuiListSubheader: {
        defaultProps: { disableSticky: true },
        styleOverrides: {
          root: {
            ...theme.typography.subtitle2,
            color: theme.palette.text.primary,
            lineHeight: '32px',
            userSelect: 'none',
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            '.Mui-selected &': { color: 'inherit' },
          },
        },
      },
      MuiListItemSecondaryAction: {
        styleOverrides: {
          root: { right: theme.spacing(0.75) },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          listbox: {
            '& .MuiAutocomplete-option': {
              margin: theme.spacing(0, 1),
              padding: theme.spacing(0.5, 1),
              paddingLeft: `${theme.spacing(1)} !important`,
              minHeight: 32,
              borderRadius: theme.shape.borderRadius,

              [`&[aria-selected="true"]`]: {
                backgroundColor: theme.palette.action.selected,
              },
            },
          },
          groupLabel: {
            background: 'transparent',
          },
        },
      },

      MuiButton: {
        defaultProps: {
          variant: 'outlined',
          color: 'secondary',
        },
        styleOverrides: {
          root: {
            minHeight: 32,
            paddingTop: theme.spacing(0.5),
            paddingBottom: theme.spacing(0.5),
            '&.MuiButton-outlined, &.MuiButton-contained': {
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
            },
            '& .MuiButton-iconSizeMedium > *:nth-of-type(1)': { fontSize: 24 },

            '&.Mui-disabled': { color: theme.palette.text.disabled },
          },
          sizeSmall: {
            minHeight: 24,
            paddingTop: theme.spacing(0.25),
            paddingBottom: theme.spacing(0.25),
            '&.MuiButton-outlined, &.MuiButton-contained': {
              paddingLeft: theme.spacing(10 / 8),
              paddingRight: theme.spacing(10 / 8),
            },
          },
          sizeLarge: {
            minHeight: 48,
            '&.MuiButton-outlined, &.MuiButton-contained': {
              paddingLeft: theme.spacing(22 / 8),
              paddingRight: theme.spacing(22 / 8),
            },
            fontSize: '1rem',
            borderRadius: theme.shape.borderRadius * (48 / 32),
            '& .MuiButton-iconSizeLarge > *:nth-of-type(1)': { fontSize: 24 },
          },

          outlined: {
            '&, &:hover, &.Mui-disabled': { border: 'none' },
            boxShadow: `0 0 0 1px ${theme.palette.action.inputOutline} inset,
                 0 ${theme.palette.mode === 'dark' ? '' : '-'}1px 0 0 ${
              theme.palette.action.inputOutline
            } inset`,
            backgroundColor: theme.palette.action.input,

            '&.Mui-disabled': {
              boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,
              backgroundColor: 'transparent',
            },
          },
          outlinedPrimary: {
            '&:hover': {
              backgroundColor: colord(theme.palette.action.input)
                .mix(theme.palette.primary.main, theme.palette.action.hoverOpacity)
                .toHslString(),
            },
          },
          outlinedSecondary: {
            '&:hover': {
              backgroundColor: colord(theme.palette.action.input)
                .mix(theme.palette.secondary.main, theme.palette.action.hoverOpacity)
                .toHslString(),
            },
          },

          contained: {
            boxShadow: `0 -1px 0 0 rgba(0, 0, 0, 0.12) inset, ${theme.shadows[2]}`,
            '&:hover': {
              boxShadow: `0 -1px 0 0 rgba(0, 0, 0, 0.12) inset, ${theme.shadows[4]}`,
            },
            '&:active': {
              boxShadow: `0 -1px 0 0 rgba(0, 0, 0, 0.12) inset, ${theme.shadows[8]}`,
            },
          },
          containedPrimary: {
            '&:hover': { backgroundColor: buttonPrimaryHover },
          },
          containedSecondary: {
            '&:hover': { backgroundColor: buttonSecondaryHover },
          },
        },
      },
      MuiLoadingButton: {
        defaultProps: {
          variant: 'outlined',
          color: 'secondary',
        },
      },
      MuiButtonGroup: {
        styleOverrides: {
          grouped: { minWidth: 32 },
        },
      },

      MuiToggleButtonGroup: {
        defaultProps: {
          color: 'primary',
        },
        styleOverrides: {
          groupedHorizontal: {
            '&:not(:first-of-type)': {
              borderLeft: 0,
              clipPath: 'inset(0 0 0 1px)',
            },
          },
          groupedVertical: {
            '&:not(:first-of-type)': {
              borderTop: 0,
              clipPath: 'inset(1px 0 0 0)',
            },
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            '&, &.Mui-selected': {
              backgroundColor: theme.palette.action.input,
            },
            transition: theme.transitions.create(['background-color', 'color'], {
              duration: theme.transitions.duration.short,
            }),

            border: 0,
            boxShadow: `0 0 0 1px ${theme.palette.action.inputOutline} inset,
            0 ${theme.palette.mode === 'dark' ? '' : '-'}1px 0 0 ${
              theme.palette.action.inputOutline
            } inset`,
            '.MuiToggleButtonGroup-vertical &:not(:last-of-type)': {
              boxShadow: `0 0 0 1px ${theme.palette.action.inputOutline} inset`,
            },

            '&:not(.Mui-disabled):hover': {
              backgroundColor: colord(theme.palette.action.input)
                .mix(theme.palette.text.primary, theme.palette.action.hoverOpacity)
                .toHslString(),
              zIndex: 1,
            },

            '&.Mui-selected:hover': {
              '.MuiToggleButton-standard&': {
                backgroundColor: colord(theme.palette.action.input)
                  .mix(theme.palette.action.hover, theme.palette.action.hoverOpacity)
                  .toHslString(),
              },
              '.MuiToggleButton-primary&': {
                backgroundColor: colord(theme.palette.action.input)
                  .mix(theme.palette.primary.main, theme.palette.action.hoverOpacity)
                  .toHslString(),
              },
              '.MuiToggleButton-secondary&': {
                backgroundColor: colord(theme.palette.action.input)
                  .mix(theme.palette.secondary.main, theme.palette.action.hoverOpacity)
                  .toHslString(),
              },
            },

            '&.Mui-disabled': {
              boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,
              backgroundColor: 'transparent',
              border: 0,
            },

            '&.Mui-selected::after': {
              content: "''",
              display: 'block',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: 32,
              width: `calc(100% - 16px)`,

              height: 3,
              borderRadius: 1.5,
              backgroundColor: 'currentColor',

              '.MuiToggleButtonGroup-vertical &': {
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                maxHeight: 32,
                height: `calc(100% - 16px)`,

                width: 3,
              },
            },
          },

          sizeSmall: {
            minHeight: 24,
            minWidth: 24,
            padding: `${(24 - 18) / 2}px 10px`,
            '& .MuiSvgIcon-root': {
              margin: `0 ${-(10 - (24 - 18) / 2)}px`,
              fontSize: 18,
            },
          },
          sizeMedium: {
            minHeight: 32,
            minWidth: 32,
            padding: `${(32 - 24) / 2}px 16px`,
            '& .MuiSvgIcon-root': { margin: `0 ${-(16 - (32 - 24) / 2)}px` },
          },
          sizeLarge: {
            minHeight: 48,
            minWidth: 48,
            padding: `${(48 - 24) / 2}px 22px`,
            '& .MuiSvgIcon-root': { margin: `0 ${-(22 - (48 - 24) / 2)}px` },
          },
        },
      },

      MuiIconButton: {
        defaultProps: {
          TouchRippleProps: { center: false },
        },
        styleOverrides: {
          sizeSmall: {
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(0.5),
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            '&:not(.MuiFab-primary):not(.MuiFab-secondary):not(.Mui-disabled)': {
              backgroundColor: fabBackgroundColor,
              color: theme.palette.text.primary,

              '&:hover': {
                backgroundColor: colord(fabBackgroundColor)
                  .mix(theme.palette.action.hover, theme.palette.action.hoverOpacity)
                  .alpha(1)
                  .toHslString(),
              },
            },

            '&.Mui-disabled': {
              backgroundColor: colord(theme.palette.background.default)
                .mix(
                  theme.palette.action.disabledBackground,
                  colord(theme.palette.action.disabledBackground).alpha()
                )
                .alpha(1)
                .toHslString(),
            },
          },
          primary: {
            boxShadow: `0 -1px 0 0 rgba(0, 0, 0, 0.12) inset, ${theme.shadows[6]}`,
            '&:hover': { backgroundColor: buttonPrimaryHover },
            '&:active': {
              boxShadow: `0 -1px 0 0 rgba(0, 0, 0, 0.12) inset, ${theme.shadows[12]}`,
            },
          },
          secondary: {
            boxShadow: `0 -1px 0 0 rgba(0, 0, 0, 0.12) inset, ${theme.shadows[6]}`,
            '&:hover': { backgroundColor: buttonSecondaryHover },
            '&:active': {
              boxShadow: `0 -1px 0 0 rgba(0, 0, 0, 0.12) inset, ${theme.shadows[12]}`,
            },
          },
          sizeSmall: {
            minWidth: 32,
            minHeight: 32,
            width: 32,
            height: 32,
          },
        },
      },

      MuiChip: {
        defaultProps: { size: 'small' },
        styleOverrides: {
          sizeMedium: {
            height: 'auto',
            minHeight: 32,
            padding: '4px 0',
            '&.MuiChip-outlined': { padding: '3px 0' },
          },
          sizeSmall: {
            height: 'auto',
            minHeight: 24,
            padding: '2px 0',
            '&.MuiChip-outlined': { padding: '1px 0' },
          },

          clickable: {
            '&.MuiChip-filledPrimary:hover': {
              backgroundColor: buttonPrimaryHover,
            },
            '&.MuiChip-filledSecondary:hover': {
              backgroundColor: buttonSecondaryHover,
            },
          },
        },
      },

      MuiSwitch: {
        defaultProps: {
          size: 'small',
          color: 'success',
        },
        styleOverrides: {
          sizeMedium: {
            width: 52 + (38 - 32),
            height: 32 + (38 - 32),
            padding: (38 - 32) / 2,

            '& .MuiSwitch-thumb': { width: 18, height: 18 },
            '& .MuiSwitch-switchBase': { padding: 10 },

            '& .Mui-checked .MuiSwitch-thumb': { width: 24, height: 24 },
            '& .MuiSwitch-switchBase.Mui-checked': {
              padding: 7,
              transform: 'translateX(20px)',
            },
          },
          sizeSmall: {
            width: 32 + (28 - 20),
            height: 20 + (28 - 20),
            padding: (28 - 20) / 2,

            '& .MuiSwitch-thumb': { width: 10, height: 10 },
            '& .MuiSwitch-switchBase': { padding: 9 },

            '& .Mui-checked .MuiSwitch-thumb': { width: 14, height: 14 },
            '& .MuiSwitch-switchBase.Mui-checked': {
              padding: 7,
              transform: 'translateX(12px)',
            },
          },

          track: {
            borderRadius: 32 / 2,
            backgroundColor: theme.palette.action.input,
            boxShadow: `0 0 0 1px ${theme.palette.text.disabled} inset`,
            '.Mui-disabled + &': {
              backgroundColor: theme.palette.text.disabled,
            },

            opacity: 1,
            '.MuiSwitch-switchBase.Mui-checked:not(.Mui-disabled) + &': {
              opacity: 1,
            },
            '.MuiSwitch-switchBase.Mui-checked + &': {
              boxShadow: 'none',
            },
          },
          switchBase: { color: theme.palette.text.primary },
          thumb: {
            borderRadius: 100,
            boxShadow: theme.shadows[1],

            background: theme.palette.text.secondary,
            '.Mui-checked &': {
              backgroundColor: theme.palette.secondary.contrastText,
            },

            position: 'relative',
            '.Mui-checked &::before': {
              content: "''",
              position: 'absolute',
              width: '100%',
              height: '100%',
              left: 0,
              top: 0,

              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 18 18"><polyline stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" points="2.705 8.29 7 12.585 15.295 4.29" fill="none" stroke="${encodeURIComponent(
                theme.palette.secondary.main
              )}" /></svg>')`,
              backgroundPosition: 'center',
              backgroundSize: `${(16 / 24) * 100}%`,
              backgroundRepeat: 'no-repeat',
            },
            '.MuiSwitch-sizeSmall .Mui-checked &::before': {
              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 18 18"><polyline stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="2.705 8.29 7 12.585 15.295 4.29" fill="none" stroke="${encodeURIComponent(
                theme.palette.secondary.main
              )}" /></svg>')`,
            },

            transition: theme.transitions.create(['transform', 'background-color'], {
              duration: theme.transitions.duration.shortest,
            }),

            '.MuiSwitch-root:active .MuiSwitch-switchBase:not(.Mui-disabled) &': {
              transform: `scale(${28 / 18})`,
            },
            '.MuiSwitch-root.MuiSwitch-sizeSmall:active .MuiSwitch-switchBase:not(.Mui-disabled) &':
              {
                transform: `scale(${16 / 10})`,
              },
            '& + .MuiTouchRipple-root': { zIndex: -1 },

            '.MuiSwitch-root:active .MuiSwitch-switchBase.Mui-checked:not(.Mui-disabled) &': {
              transform: `scale(${28 / 24})`,
            },
            '.MuiSwitch-root.MuiSwitch-sizeSmall:active .MuiSwitch-switchBase.Mui-checked:not(.Mui-disabled) &':
              {
                transform: `scale(${16 / 14})`,
              },

            '.MuiSwitch-switchBase.Mui-disabled &': {
              opacity: theme.palette.action.disabledOpacity,
            },
            '.MuiSwitch-switchBase.Mui-disabled.Mui-checked &': {
              opacity: 1,
              '&::before': { opacity: theme.palette.action.disabledOpacity },
            },
          },

          colorPrimary: {
            '&.Mui-checked ': {
              '& .MuiSwitch-thumb::before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 18 18"><polyline stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" points="2.705 8.29 7 12.585 15.295 4.29" fill="none" stroke="${encodeURIComponent(
                  theme.palette.primary.main
                )}" /></svg>')`,
              },
              '.MuiSwitch-sizeSmall & .MuiSwitch-thumb::before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 18 18"><polyline stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="2.705 8.29 7 12.585 15.295 4.29" fill="none" stroke="${encodeURIComponent(
                  theme.palette.primary.main
                )}" /></svg>')`,
              },
            },
          },

          colorSuccess: {
            '&.Mui-checked': {
              color: theme.palette.success.light,
              '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.success.light,
              },

              '& .MuiSwitch-thumb::before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 18 18"><polyline stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" points="2.705 8.29 7 12.585 15.295 4.29" fill="none" stroke="${encodeURIComponent(
                  theme.palette.success.main
                )}" /></svg>')`,
              },
              '.MuiSwitch-sizeSmall & .MuiSwitch-thumb::before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 18 18"><polyline stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="2.705 8.29 7 12.585 15.295 4.29" fill="none" stroke="${encodeURIComponent(
                  theme.palette.success.main
                )}" /></svg>')`,
              },
            },
          },
        },
      },

      MuiRadio: {
        styleOverrides: {
          root: { padding: theme.spacing(1) },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: { padding: theme.spacing(1) },
        },
      },

      MuiSlider: {
        styleOverrides: {
          thumb: {
            color: theme.palette.common.white,
            transformOrigin: '50% 50%',

            '&::before': {
              boxShadow:
                theme.palette.mode === 'dark'
                  ? theme.shadows[1].replace(')', ', 0.24)')
                  : `${theme.shadows[1]}, 0 0 0 1px ${theme.palette.divider}`,
            },

            '&:hover': {
              '& > input': { transform: `scale(${1 + 2 / 20})` },
            },
          },

          mark: { width: 3, height: 3 },

          valueLabel: {
            borderRadius: theme.shape.borderRadius,

            '&::before': {
              borderRadius: theme.shape.borderRadius / 2,
              width: 10,
              height: 10,
              bottom: 1,
            },
          },
        },
      },

      MuiFormControlLabel: {
        defaultProps: {
          componentsProps: { typography: { variant: 'body2' } },
        },
        styleOverrides: {
          root: {
            display: 'flex',
            alignItems: 'flex-start',
            '& .MuiSwitch-root': {
              marginRight: theme.spacing(1),

              '&.MuiSwitch-sizeSmall + .MuiFormControlLabel-label': {
                marginTop: 4,
              },
            },

            '&:hover .MuiCheckbox-root:not(.Mui-disabled), &:hover .MuiRadio-root:not(.Mui-disabled)':
              {
                backgroundColor: theme.palette.action.hover,
              },
          },
          label: {
            marginTop: 10,
          },
          labelPlacementStart: {
            '& .MuiSwitch-root': { marginLeft: theme.spacing(1) },
          },
        },
      },

      MuiTabs: {
        styleOverrides: {
          indicator: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',

            transitionTimingFunction: transitionEasingStrong,
            transitionDuration: `${theme.transitions.duration.complex}ms`,

            height: 3,
            '.MuiTabs-vertical &': { width: 3 },

            '& > .MuiTabs-indicatorSpan': {
              width: '100%',
              height: '100%',
              maxWidth: 32,
              maxHeight: 16,

              borderRadius: 1.5,
              backgroundColor: theme.palette.primary.main,

              transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
              }),
              '.MuiTabs-root:active &': { transform: 'scaleX(1.25)' },
              '.MuiTabs-vertical:active &': { transform: 'scaleY(1.25)' },
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            borderRadius: theme.shape.borderRadius,

            transition: theme.transitions.create(['background-color', 'color'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': { backgroundColor: theme.palette.action.hover },
            '&.Mui-selected:hover': {
              backgroundColor: colord(theme.palette.primary.main)
                .alpha(theme.palette.action.hoverOpacity)
                .toHslString(),
            },
          },
        },
      },

      MuiBadge: {
        variants: [
          {
            props: { variant: 'inlineDot' },
            style: {
              marginLeft: theme.spacing(1),
              marginRight: theme.spacing(-1),

              '& .MuiBadge-badge': {
                position: 'static',
                transform: 'none',

                minWidth: theme.spacing(1),
                height: theme.spacing(1),
                borderRadius: theme.spacing(0.5),
                padding: 0,
              },
            },
          },
        ],
      },

      MuiAlertTitle: {
        styleOverrides: {
          root: {
            ...theme.typography.subtitle2,
            lineHeight: '1.5rem',
          },
        },
      },

      MuiStepIcon: {
        styleOverrides: {
          root: {
            color: theme.palette.action.hover,
            '&.Mui-completed:not(.Mui-active)': {
              color: theme.palette.text.disabled,
            },
          },
          text: {
            fontWeight: theme.typography.fontWeightBold,
            fill: theme.palette.text.secondary,

            '.Mui-active &': { fill: theme.palette.primary.contrastText },
          },
        },
      },
      MuiStepConnector: {
        styleOverrides: {
          line: {
            borderColor: theme.palette.divider,
          },
        },
      },

      MuiCircularProgress: {
        styleOverrides: {
          circle: {
            strokeLinecap: 'round',
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: theme.shape.borderRadius },
          bar: { borderRadius: theme.shape.borderRadius },
        },
      },

      MuiRating: {
        styleOverrides: {
          iconFilled: { color: theme.palette.text.secondary },
          icon: {
            // https://github.com/mui/material-ui/issues/32557
            '& .MuiSvgIcon-root': { pointerEvents: 'auto' },
          },
        },
      },

      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: theme.typography.fontWeightMedium,
          },
          colorDefault: {
            backgroundColor: theme.palette.action.selected,
            color: theme.palette.text.secondary,
          },
        },
      },

      MuiYearPicker: {
        styleOverrides: {
          root: {
            '& .PrivatePickersYear-yearButton': {
              ...theme.typography.button,
              fontSize: '1rem',
            },
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            background: 'none',
          },
        },
      },
    },
  };
};
export default components;
