import { toast } from 'react-toastify';
import { JobsContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';

const OpenJobsContext = createContext();

export const loader = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const jobType = url.searchParams.get('jobType');
    const sort = url.searchParams.get('sort');
    const page = url.searchParams.get('page');

    const params = { jobType, sort, page };
    if (search) params.search = search;

    let { data } = await customFetch.get('/job', {
      params,
    });

    const jobs = data.jobs.map((job) => {
      const jb = {
        _id: job._id,
        jobType: job.jobType,
        company: job.company,
        position: job.position,
        jobLocation: job.jobLocation,
      };

      return jb;
    });

    data = {
      jobs,
    };

    return {
      data,
      searchValues: { search, jobType, sort },
    };
  } catch (error) {
    console.log('here');
    toast.error(error.response.data.msg);

    return error;
  }
};

const ViewOpenJobs = () => {
  const data = useLoaderData();

  return (
    <OpenJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </OpenJobsContext.Provider>
  );
};
export default ViewOpenJobs;

export const useOpenJobsContext = () => useContext(OpenJobsContext);
