import { FormRow, FormRowSelect } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import { JOB_APPLICATION_STATUS, JOB_TYPE } from '../../../utils/constants';
import { Form, useNavigation, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

export const loader = async ({ params }) => {
  console.log(params.id);

  try {
    let { data } = await customFetch.get(
      `/job-applications/custom/${params.id}`
    );

    const job = {
      _id: data.jobApplication._id,
      jobStatus: data.jobApplication.status,
      jobType: data.jobApplication.jobId.jobType,
      company: data.jobApplication.jobId.company,
      position: data.jobApplication.jobId.position,
      jobLocation: data.jobApplication.jobId.jobLocation,
    };

    data = {
      job,
    };

    return data;
  } catch (error) {
    toast.error(error.response);

    return redirect('/dashboard/all-jobs');
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.patch(`/job-applications/custom/${params.id}`, data);
    toast.success('Job edited successfully');

    return redirect('/dashboard/all-jobs');
  } catch (error) {
    toast.error(error.response.data.msg);

    return error;
  }
};

const EditJob = () => {
  const { job } = useLoaderData();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">edit job</h4>
        <div className="form-center">
          <FormRow type="text" name="position" defaultValue={job.position} />
          <FormRow type="text" name="company" defaultValue={job.company} />
          <FormRow
            type="text"
            labelText="job location"
            name="jobLocation"
            defaultValue={job.jobLocation}
          />

          <FormRowSelect
            name="status"
            labelText="job status"
            defaultValue={job.jobStatus}
            list={Object.values(JOB_APPLICATION_STATUS)}
          />
          <FormRowSelect
            name="jobType"
            labelText="job type"
            defaultValue={job.jobType}
            list={Object.values(JOB_TYPE)}
          />
          <button
            type="submit"
            className="btn btn-block form-btn "
            disabled={isSubmitting}
          >
            {isSubmitting ? 'submitting...' : 'submit'}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default EditJob;
