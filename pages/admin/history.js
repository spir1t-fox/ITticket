import Layout from '../../components/layout/Layout'
import AdminHistoryTable from '../../components/admin/AdminHistoryTable'

export default function AdminHistory() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">System History</h1>
            <p className="mt-2 text-gray-600">View system activity and ticket history.</p>
          </div>
          
          <AdminHistoryTable />
        </div>
      </div>
    </Layout>
  )
}
