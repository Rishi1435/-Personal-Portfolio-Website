import ProjectQlue from '../components/ProjectQlue';

/*
 * Single source of truth for the Qlue project. Imported by:
 *   - Projects.jsx  → the featured card on the main portfolio
 *   - pages/QlueLive.jsx → the dedicated /qlue-live demonstration screen
 * Keeping it here means the two views can never drift out of sync.
 */
export const qlue = {
  id: 'qlue',
  index: '01',
  title: 'Qlue',
  subtitle: 'AI-Powered Voice Interview Simulation App — v2',
  description:
    'A voice-first, AI-native mock-interview platform for iOS, Android, and web — a Flutter client backed by a Node.js serverless AWS stack (SAM / Lambda). It reads your uploaded résumé (parsed by Textract), acts as a realistic AI interviewer that asks résumé-tailored questions, and scores every spoken answer in real time. Amazon Bedrock (Nemotron-super) drives question generation and scoring; Amazon Polly speaks the questions back over a WebSocket, sub-2s per turn; and after the session an async pipeline has Claude 3 Haiku write a detailed feedback report delivered by push. Placed Top 5 of 160+ projects at Project Space. Four interview modes: résumé-based technical, HR behavioural, self-introduction coaching, and URL/website-based tutoring.',
  modes: ['Resume Technical', 'HR Behavioural', 'Self-Introduction', 'URL Tutoring'],
  tech: ['Flutter', 'Dart', 'Provider', 'Node.js', 'AWS SAM', 'AWS Lambda', 'Bedrock (Nemotron-super)', 'Claude 3 Haiku', 'Amazon Polly', 'Textract', 'DynamoDB', 'S3', 'SNS', 'API Gateway (WebSocket)', 'Firebase Auth', 'FCM'],
  github: 'https://github.com/Rishi1435/Qlue-v2',
  demo: '/qlue-live', // in-app route to the live demonstration screen
  metrics: [
    { value: '649', label: 'Students Reached', note: 'Unique students who ran a Qlue session during the Project Space showcase.' },
    { value: '4', label: 'Interview Modes', note: 'Résumé technical, HR behavioural, self-introduction, and URL/website tutoring.' },
    { value: '<2s', label: 'AI Response Time', note: 'End-of-turn to first audio byte over the WebSocket, measured client-side.' },
    { value: '5', label: 'Polly AI Voices', note: 'Five selectable Amazon Polly neural voices: Tiffany, Ruth, Joanna, Matthew, Stephen.' },
    { value: 'Top 5', label: 'Project Space Rank', note: 'Placed top 5 of 160+ projects judged at Project Space.' },
  ],
  Visual: ProjectQlue,
  status: 'SOURCE',
  featured: true,
};

export default qlue;
