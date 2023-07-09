import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import JobPost from '../components/JobPost';
import Wrapper from '../assets/wrappers/JobsContainer';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/job/my-jobs');

    return {
      data,
    };
  } catch (error) {
    toast.error(error.response.data.msg);
    return error;
  }
};

const MyJobPosts = () => {
  const { data } = useLoaderData();

  console.log(data);

  return (
    <Wrapper>
      <div className="jobs">
        {data.jobs.map((job) => (
          <JobPost key={job._id} {...job} />
        ))}
      </div>
    </Wrapper>
  );
};
export default MyJobPosts;
