import Layout from '../../components/layout/Layout'
import UserHistoryList from '../../components/user/UserHistoryList'

export default function UserHistory() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Ticket History</h1>
            <p className="mt-2 text-gray-600">View your resolved and closed tickets.</p>
          </div>
          
          <UserHistoryList />
        </div>
      </div>
    </Layout>
  )
}
