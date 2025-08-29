import { jobsAPI, applicationsAPI, authAPI } from './src/services/api.ts';

async function testJobCreationAndApplication() {
  try {
    console.log('🚀 Starting test: Create job and apply...');
    
    // Step 1: Login as company (nainabdi10@gmail.com) to create a job
    console.log('🏢 Logging in as company (nainabdi10@gmail.com)...');
    const companyLogin = await authAPI.login('nainabdi10@gmail.com', 'Serperior140!');
    console.log('✅ Company login successful');
    
    // Step 2: Create a job as the company
    console.log('📝 Creating a test job as company...');
    const jobData = {
      title: "Test Software Engineer Position",
      description: "This is a test job created by the automated script to test the application flow.",
      requirements: "JavaScript, React, Node.js experience preferred",
      assessmentLink: "https://example.com/assessment"
    };
    
    const createdJob = await jobsAPI.create(jobData);
    console.log('✅ Job created successfully:', createdJob.job.id);
    console.log('Job title:', createdJob.job.title);
    
    // Step 3: Login as candidate (nain@boardroomco.ca) to apply
    console.log('👤 Logging in as candidate (nain@boardroomco.ca)...');
    const candidateLogin = await authAPI.login('nain@boardroomco.ca', 'Serperior140!');
    console.log('✅ Candidate login successful');
    
    // Step 4: Apply to the job as the candidate
    console.log('📮 Applying to the job as nain@boardroomco.ca...');
    const application = await applicationsAPI.apply(createdJob.job.id, "This is a test application from the automated script.");
    console.log('✅ Application submitted successfully!');
    console.log('Application ID:', application.application.id);
    console.log('Status:', application.application.status);
    
    console.log('\n🎉 Test completed successfully!');
    console.log('Job ID:', createdJob.job.id);
    console.log('Application ID:', application.application.id);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run the test
testJobCreationAndApplication();
