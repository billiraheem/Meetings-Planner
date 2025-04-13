import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { CustomInput } from '../components/Input';
import { CustomButton } from '../components/Button';
import { meetingAPI } from '../APIs/api';

interface MeetingFormValues {
    title: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    participants: string;
}

export const MeetingForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = id && id !== 'new';
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditing);

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        startDate: Yup.string().required('Start date is required'),
        startTime: Yup.string().required('Start time is required'),
        endDate: Yup.string().required('End date is required'),
        endTime: Yup.string().required('End time is required')
            .test(
                'is-greater',
                'End time must be after start time',
                function (endTime) {
                    const { startDate, startTime, endDate } = this.parent;
                    if (!startDate || !startTime || !endDate || !endTime) return true;

                    const start = new Date(`${startDate}T${startTime}`);
                    const end = new Date(`${endDate}T${endTime}`);
                    return end > start;
                }
            ),
        participants: Yup.string().required('At least one participant is required')
            .test(
                'has-participants',
                'Enter at least one valid email address',
                function (value) {
                    if (!value) return false;
                    const emails = value.split(',').map(email => email.trim());
                    return emails.length > 0 && emails[0] !== '';
                }
            ),
    });

    const initialValues: MeetingFormValues = {
        title: '',
        startDate: new Date().toISOString().split('T')[0],
        startTime: new Date().toTimeString().slice(0, 5),
        endDate: new Date().toISOString().split('T')[0],
        endTime: new Date(Date.now() + 3600000).toTimeString().slice(0, 5), // 1 hour later
        participants: '',
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);

                // Convert form values to meeting data format
                const startDateTime = new Date(`${values.startDate}T${values.startTime}`);
                const endDateTime = new Date(`${values.endDate}T${values.endTime}`);

                const meetingData = {
                    title: values.title,
                    startTime: startDateTime,
                    endTime: endDateTime,
                    participants: values.participants.split(',').map(p => p.trim()),
                };

                if (isEditing) {
                    const response = await meetingAPI.updateMeeting(id, meetingData);
                    toast.success(response.data.responseMessage || 'Meeting updated successfully');
                } else {
                    const resp = await meetingAPI.createMeeting(meetingData);
                    toast.success(resp.data.responseMessage || 'Meeting created successfully');
                }

                console.log("Meeting created:", meetingData)

                navigate('/home');
            } catch (error: any) {
                const errorMsg = error.response?.data?.errorMessage || `Failed to ${isEditing ? 'update' : 'create'} meeting`;
                toast.error(errorMsg);
            } finally {
                setIsLoading(false);
            }
        },
    });

    useEffect(() => {
        if (isEditing) {
            fetchMeeting();
        }
    }, [isEditing, id]);

    const fetchMeeting = async () => {
        try {
            setInitialLoading(true);
            const response = await meetingAPI.getMeeting(id!);
            const meeting = response.data.data;

            // Convert meeting data to form values
            const startDateTime = new Date(meeting.startTime);
            const endDateTime = new Date(meeting.endTime);

            formik.setValues({
                title: meeting.title,
                startDate: startDateTime.toISOString().split('T')[0],
                startTime: startDateTime.toTimeString().slice(0, 5),
                endDate: endDateTime.toISOString().split('T')[0],
                endTime: endDateTime.toTimeString().slice(0, 5),
                participants: meeting.participants.join(', '),
            });
        } catch (error: any) {
            toast.error(error.response?.data?.errorMessage || 'Failed to fetch meeting details');
            navigate('/home');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    // Check if a field is valid
    // const isFieldValid = (fieldName: string): boolean => {
    //     return formik.touched[fieldName as keyof typeof formik.touched] === true && 
    //            !formik.errors[fieldName as keyof typeof formik.errors];
    // };

    // Check if a field should be disabled
    // const shouldFieldBeDisabled = (fieldName: string): boolean => {
    //     // For editing mode, don't disable fields
    //     if (isEditing) return false;
        
    //     switch (fieldName) {
    //         case 'title':
    //             return false; // First field is always enabled
    //         case 'startDate':
    //             return !isFieldValid('title');
    //         case 'startTime':
    //             return !isFieldValid('title') || !isFieldValid('startDate');
    //         case 'endDate':
    //             return !isFieldValid('title') || !isFieldValid('startDate') || !isFieldValid('startTime');
    //         case 'endTime':
    //             return !isFieldValid('title') || !isFieldValid('startDate') || 
    //                    !isFieldValid('startTime') || !isFieldValid('endDate');
    //         case 'participants':
    //             return !isFieldValid('title') || !isFieldValid('startDate') || 
    //                    !isFieldValid('startTime') || !isFieldValid('endDate') || 
    //                    !isFieldValid('endTime');
    //         default:
    //             return false;
    //     }
    // };

    if (initialLoading) {
        return <div className="loading">Loading meeting data...</div>;
    }

    return (
        <div className="meeting-form-container">
            <div className="form-header">
                <button onClick={handleGoBack} className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back
                </button>
                <h1>{isEditing ? 'Edit Meeting' : 'Create New Meeting'}</h1>
            </div>

            <form onSubmit={formik.handleSubmit} className="meeting-form">
                <CustomInput
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Meeting Title"
                    error={formik.touched.title ? formik.errors.title : ''}
                    // disabled={shouldFieldBeDisabled('title')}
                    required
                />

                <div className="form-row">
                    <div className="form-column">
                        <CustomInput
                            type="date"
                            name="startDate"
                            value={formik.values.startDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            label="Start Date"
                            error={formik.touched.startDate ? formik.errors.startDate : ''}
                            // disabled={shouldFieldBeDisabled('startDate')}
                            required
                        />
                    </div>
                    <div className="form-column">
                        <CustomInput
                            type="time"
                            name="startTime"
                            value={formik.values.startTime}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            label="Start Time"
                            error={formik.touched.startTime ? formik.errors.startTime : ''}
                            // disabled={shouldFieldBeDisabled('startTime')}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-column">
                        <CustomInput
                            type="date"
                            name="endDate"
                            value={formik.values.endDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            label="End Date"
                            error={formik.touched.endDate ? formik.errors.endDate : ''}
                            // disabled={shouldFieldBeDisabled('endDate')}
                            required
                        />
                    </div>
                    <div className="form-column">
                        <CustomInput
                            type="time"
                            name="endTime"
                            value={formik.values.endTime}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            label="End Time"
                            error={formik.touched.endTime ? formik.errors.endTime : ''}
                            // disabled={shouldFieldBeDisabled('endTime')}
                            required
                        />
                    </div>
                </div>

                <CustomInput
                    type="text"
                    name="participants"
                    value={formik.values.participants}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Participants (comma separated)"
                    placeholder="John Doe, Jane Smith"
                    error={formik.touched.participants ? formik.errors.participants : ''}
                    // disabled={shouldFieldBeDisabled('participants')}
                    required
                />

                <div className="form-buttons">
                    <CustomButton
                        type="button"
                        onClick={handleGoBack}
                        className="cancel-button"
                    >
                        Cancel
                    </CustomButton>
                    <CustomButton
                        type="submit"
                        disabled={isLoading || !formik.isValid}
                        className="submit-button"
                    >
                        {isLoading ? 'Saving...' : isEditing ? 'Edit Meeting' : 'Create Meeting'}
                    </CustomButton>
                </div>
            </form>
        </div>
    );
};