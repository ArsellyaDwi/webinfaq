import { getActivities, getDonations } from './actions';
import ClientApp from './ClientApp';

export default async function Home() {
  const initialActivities = await getActivities();
  const initialDonations = await getDonations();

  return (
    <ClientApp 
      initialActivities={initialActivities} 
      initialDonations={initialDonations} 
    />
  );
}
