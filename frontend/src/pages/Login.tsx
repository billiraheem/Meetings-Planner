import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomInput } from '../components/Input';
import { CustomButton } from '../components/Button';
import { authAPI } from '../APIs/api';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(5, 'Password must be at least 5 characters')
      .max(10, 'Password must not exceed 10 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await authAPI.login(values);
        console.log(response)
        toast.success(response.data.responseMessage);
        navigate('/home');
      } catch (error: any) {
        const errorMsg = error.response?.data?.errorMessage || 'Login failed';
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Check if a field is valid
  // const isFieldValid = (fieldName: string): boolean => {
  //   return formik.touched[fieldName as keyof typeof formik.touched] === true && 
  //          !formik.errors[fieldName as keyof typeof formik.errors];
  // };

  // Check if a field should be disabled
  // const shouldFieldBeDisabled = (fieldName: string): boolean => {
  //   switch (fieldName) {
  //     case 'email':
  //       return false; // First field is always enabled
  //     case 'password':
  //       return !isFieldValid('email');
  //     default:
  //       return false;
  //   }
  // };

  return (
    <div className="login-container">
      <h1>Login to Scheduler</h1>
      <form onSubmit={formik.handleSubmit} className="login-form">
        <CustomInput
          type="email"
          name="email"
          placeholder='Enter your email'
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Email"
          error={formik.touched.email ? formik.errors.email : ''}
          required
        />

        <CustomInput
          type="password"
          name="password"
          placeholder='Enter your password'
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Password"
          error={formik.touched.password ? formik.errors.password : ''}
          // disabled={shouldFieldBeDisabled('password')}
          required
        />

        <CustomButton
          type="submit"
          disabled={isLoading || !formik.isValid || !formik.dirty}
          className="login-button"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </CustomButton>
      </form>

      <p className="auth-link">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};
