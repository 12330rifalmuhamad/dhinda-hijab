import { redirect } from 'next/navigation';

export default function AdminDashboard() {
  // meaningful dashboard can be added later, for now redirect to hero management
  redirect('/admin/hero');
}
