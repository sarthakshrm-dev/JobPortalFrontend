import React from 'react'
import css from './Footer.module.css'
import MobileFooter from '../MobileFooter/MobileFooter'
import Employer from '../MobileFooter/EmployerFooter'
import Jobseeker from '../MobileFooter/JobseekerFooter'
import Recruiter from '../MobileFooter/RecruiterFooter'

const Footer = ({ isMobile, auth, user }) => {


	const { loading, error } = auth;
	const { userLoading, userError } = user;
	const userType = user?.user?.user?.userType;


	let MobileLoggedFooter = [];

	if (userType === "recruiter") {
		MobileLoggedFooter = (<Recruiter user={user} />);
	} else if (userType === "employer") {
		MobileLoggedFooter = (<Employer user={user} />);
	} else if (userType === "jobseeker") {
		MobileLoggedFooter = (<Jobseeker user={user} />);
	}
	return (
		<>

			{isMobile ? (
				<>
					{user.user && !loading && !error && !userLoading && !userError && MobileLoggedFooter}
				</>
			) : null}

		</>
	)
}

export default Footer