import * as yup from 'yup';

const phoneRegExp =
  /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;

const fileFormats = ['pdf', 'doc', 'docx', 'png', 'jpg'];

const validateFileFormat = (value) => {
  if (!value) return true; // If no file, the validation will be handled by 'required'
  const extension = value.name.split('.').pop().toLowerCase();
  return fileFormats.includes(extension);
};

export const candidateSchema = (isEditing = false) =>
  yup.object().shape({
    fullName: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    gender: yup.string().required('Gender is required'),
    dob: yup
      .date()
      .max(
        new Date(Date.now() - 365 * 18 * 24 * 60 * 60 * 1000),
        'Candidate must be at least 18 years old'
      )
      .required('D.O.B is required'),
    address: yup.string().required('Address is required'),
    phoneNumber: yup
      .string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Phone number is required'),
    cv: yup
      .mixed()
      .test(
        'fileFormat',
        'Invalid file format. Only PDF, DOC, DOCX, PNG, and JPG are allowed.',
        validateFileFormat
      )
      .when('isEditing', {
        is: false,
        then: yup.mixed().required('CV attachment is required'),
      }),
    currentPosition: yup.string().required('Current position is required'),
    skills: yup
      .array()
      .min(1, 'At least one skill is required')
      .required('Skills are required'),
    experience: yup
      .number()
      .min(0, 'Year of experience cannot be a negative number')
      .max(150, 'Can not exceed 150 years of experience')
      .nullable(),
    highestLevel: yup.string().required('Highest level is required'),
    recruiterId: yup.string().required('Recruiter is required'),
    note: yup.string().max(500, 'Note must not exceed 500 characters'),
  });

export const jobSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  skills: yup
    .array()
    .min(1, 'At least one skill is required')
    .required('Skills are required'),
  startDate: yup
    .date()
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      'Start date cannot be in the past'
    )
    .required('Start date is required'),
  endDate: yup
    .date()
    .min(new Date(), 'End date cannot be in the past')
    .required('End date is required')
    .test(
      'is-after-start',
      'End date must be after start date',
      function (value) {
        const { startDate } = this.parent;
        return !startDate || !value || new Date(value) > new Date(startDate);
      }
    ),
  salaryFrom: yup
    .number()
    .min(0, 'Salary from cannot be a negative number')
    .nullable(),
  salaryTo: yup
    .number()
    .min(yup.ref('salaryFrom'), 'Salary to must be >= 0 and >= Salary from')
    .required('Salary to is required'),
  benefits: yup
    .array()
    .min(1, 'At least one benefit is required')
    .required('Benefits are required'),
  address: yup.string().required('Address is required'),
  levels: yup
    .array()
    .min(1, 'At least one level is required')
    .required('Levels are required'),
  description: yup
    .string()
    .max(500, 'Description must not exceed 500 characters'),
});

export const offerSchema = yup.object().shape({
  candidateId: yup.string().required('Candidate is required'),
  position: yup.string().required('Position is required'),
  approvedById: yup.string().required('Approver is required'),
  contractFrom: yup
    .date()
    .min(yup.ref('dueDate'), 'Contract from must be after Due date')
    .required('Contract from is required'),
  contractTo: yup
    .date()
    .min(yup.ref('contractFrom'), 'Contract to must be after contract from')
    .required('Contract to is required'),
  contractType: yup.string().required('Contract type is required'),
  level: yup.string().required('Level is required'),
  department: yup.string().required('Department is required'),
  recruiterId: yup.string().required('Recruiter owner is required'),
  dueDate: yup
    .date()
    .min(new Date(), 'Due date must be in the future')
    .required('Due date is required'),
  salary: yup
    .number()
    .positive('Basic salary must be positive')
    .max(2000000000, 'Salary can not exceed 2 Billion')
    .required('Basic salary is required'),
  note: yup.string().max(500, 'Note must not exceed 500 characters'),
});