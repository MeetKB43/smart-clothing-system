// List of validations
const Validations = {
  REQUIRED: {
    required: {
      value: true,
      message: 'This field is required.',
    },
  },
  REQUIRED_SHORT_MSG: {
    required: {
      value: true,
      message: 'Required.',
    },
  },
  EMAIL_REQUIRED: {
    required: {
      value: true,
      message: 'This field is required.',
    },
    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Please enter a valid email address.',
    },
  },
};

export default Validations;
