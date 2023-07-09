import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import Wrapper from '../assets/wrappers/JobsContainer';
import JobWrapper from '../assets/wrappers/Job';
import { ImDownload, ImProfile } from 'react-icons/im';
import JobInfo from '../components/JobInfo';
import { FormRowSelect } from '../components';
import { JOB_APPLICATION_STATUS } from '../../../utils/constants';

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get('/job-applications', {
      jobId: params.id,
    });

    console.log(data);

    return {
      data,
    };
  } catch (error) {
    toast.error(error.response.data.msg);
    return error;
  }
};

const ViewApplications = () => {
  const { data } = useLoaderData();

  return (
    <Wrapper>
      <h5>{data.jobApplications.length} job applications found</h5>
      <div className="jobs">
        {data.jobApplications.map((application) => (
          <JobWrapper key={application._id}>
            <div className="card">
              <header>
                <div className="main-icon">{application.status.charAt(0)}</div>
                <div className="info">
                  <div className="content-center">
                    <JobInfo
                      icon={<ImProfile />}
                      text={`${application.applicantId.name}
                      ${application.applicantId.lastName}`}
                    />

                    <FormRowSelect
                      name="status"
                      labelText="Application status"
                      defaultValue={application.status}
                      list={Object.values(JOB_APPLICATION_STATUS)}
                      onChange={(e) => {
                        customFetch
                          .patch(`job-applications/${application._id}`, {
                            status: e.target.value,
                          })
                          .then((res) => {
                            console.log(res);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                    />
                  </div>
                  {application.applicantId.cv && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginTop: '1rem',
                      }}
                    >
                      <ImDownload />
                      <a
                        href={application.applicantId.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: 'none',
                          color: 'inherit',
                          fontSize: '1rem',
                        }}
                      >
                        Click here to download applicant CV
                      </a>
                    </div>
                  )}
                </div>
              </header>
            </div>
          </JobWrapper>
        ))}
      </div>
    </Wrapper>
  );
};

export default ViewApplications;
