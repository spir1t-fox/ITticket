import Layout from '../../components/layout/Layout'
import UserTicketList from '../../components/user/UserTicketList'

export default function ViewTickets() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
            <p className="mt-2 text-gray-600">View and manage your active support tickets.</p>
          </div>
          
          <UserTicketList />
        </div>
      </div>
    </Layout>
  )
}
