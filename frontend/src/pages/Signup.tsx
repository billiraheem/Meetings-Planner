import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomInput } from '../components/Input';
import { CustomButton } from '../components/Button';
import { authAPI } from '../APIs/api';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(5, 'Password must be at least 5 characters')
      .max(10, 'Password must not exceed 10 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await authAPI.signup(values);
        toast.success(response.data.responseMessage);
        navigate('/login');
      } catch (error: any) {
        const errorMsg = error.response?.data?.errorMessage || 'Sign up failed';
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Check if a field is valid
  const isFieldValid = (fieldName: string): boolean => {
    return formik.touched[fieldName as keyof typeof formik.touched] === true && 
           !formik.errors[fieldName as keyof typeof formik.errors];
  };

  // Check if a field should be disabled
  const shouldFieldBeDisabled = (fieldName: string): boolean => {
    switch (fieldName) {
      case 'name':
        return false; // First field is always enabled
      case 'email':
        return !isFieldValid('name');
      case 'password':
        return !isFieldValid('name') || !isFieldValid('email');
      case 'confirmPassword':
        return !isFieldValid('name') || !isFieldValid('email') || !isFieldValid('password');
      default:
        return false;
    }
  };

  return (
    <div className="signup-container">
      <h1>Create Account</h1>
      <form onSubmit={formik.handleSubmit} className="signup-form">
        <CustomInput
          type="text"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Name"
          error={formik.touched.name ? formik.errors.name : ''}
          required
        />

        <CustomInput
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Email"
          error={formik.touched.email ? formik.errors.email : ''}
          disabled={shouldFieldBeDisabled('email')}
          required
        />

        <CustomInput
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Password"
          error={formik.touched.password ? formik.errors.password : ''}
          disabled={shouldFieldBeDisabled('password')}
          required
        />

        <CustomInput
          type="password"
          name="confirmPassword"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Confirm Password"
          error={formik.touched.confirmPassword ? formik.errors.confirmPassword : ''}
          disabled={shouldFieldBeDisabled('confirmPassword')}
          required
        />

        <CustomButton 
          type="submit" 
          disabled={isLoading || !formik.isValid || !formik.dirty}
          className="signup-button"
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </CustomButton>
        <p className="auth-link">
        Already have an account? <Link  to="/login">Login</Link>
      </p>
      </form>

      
    </div>
  );
};


// const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const navigate = useNavigate();
//   const [errors, setErrors] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });

//   const validateField = async (field: string, value: string) => {
//     try {
//       if (field === 'name' && !value.trim()) {
//         setErrors(prev => ({ ...prev, name: 'Name is required' }));
//         return;
//       }

//       if (field === 'email') {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(value)) {
//           setErrors(prev => ({ ...prev, email: 'Incorrect email format' }));
//           return;
//         }
//       }

//       if (field === 'password') {
//         if (value.length > 10) {
//           setErrors(prev => ({ ...prev, password: 'Password must not be longer than 10 characters' }));
//           return;
//         }
//       }

//       if (field === 'confirmPassword' && value !== password) {
//         setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
//         return;
//       }

//       // Clear error if validation passes
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     } catch (error) {
//       console.error('Validation error:', error);
//     }
//   };

//   const handleSignup = async () => {
//     try {
//       const response = await signup({ name, email, password, confirmPassword });
//       toast.success(response.data.responseMessage);
//       navigate('/');
//     } catch (error: any) {
//       // toast.error(error.response?.data?.errorMessage || 'Signup failed');
//       // console.error('Signup failed:', error);
//       const errorMessage = error.response?.data?.errorMessage;
//       if (errorMessage === 'User already exists') {
//         setErrors(prev => ({ ...prev, email: errorMessage }));
//       } else if (errorMessage === 'Passwords do not match') {
//         setErrors(prev => ({ ...prev, confirmPassword: errorMessage }));
//       } else if (errorMessage === 'Invalid email format') {
//         setErrors(prev => ({ ...prev, email: errorMessage }));
//       } else {
//         setErrors(prev => ({ ...prev, email: errorMessage || 'Signup failed' }));
//       }
//     }
//   };

//   return (
//     <div className='signup-pg'>
//       <h1>Sign Up</h1>
//       <div className='signup-pg-div'>

//         <div>
//           <h3>Name</h3>
//           <CustomInput
//             className='name'
//             value={name}
//             onChange={(e) => {
//               setName(e.target.value);
//               validateField('name', e.target.value);
//             }}
//             placeholder="Name" />
//           {errors.name && <span className='error'>{errors.name}</span>}
//         </div>

//         <div>
//           <h3>Email</h3>
//           <CustomInput
//             className='email'
//             value={email}
//             onChange={(e) => {
//               setEmail(e.target.value);
//               validateField('email', e.target.value);
//             }}
//             placeholder="Email" />
//           {errors.email && <span className='error'>{errors.email}</span>}
//         </div>

//         <div>
//           <h3>Password</h3>
//           <CustomInput
//             className='password'
//             value={password}
//             onChange={(e) => {
//               setPassword(e.target.value);
//               validateField('passowrd', e.target.value)
//             }}
//             placeholder="Password"
//             type="password"
//           />
//           {errors.password && <span className='error'>{errors.password}</span>}
//         </div>

//         <div>
//           <h3>Confirm Password</h3>
//           <CustomInput
//             className='confirmPassword'
//             value={confirmPassword}
//             onChange={(e) => {
//               setConfirmPassword(e.target.value);
//               validateField('confirmPassword', e.target.value);
//             }}
//             placeholder="Confirm Password"
//             type="password"
//           />
//           {errors.confirmPassword && <span className='error'>{errors.confirmPassword}</span>}
//         </div>

//         <CustomButton className='signup-btn' onClick={handleSignup}>Sign Up</CustomButton>
//       </div>
//     </div>
//   );