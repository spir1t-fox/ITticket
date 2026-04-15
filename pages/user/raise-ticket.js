import Layout from '../../components/layout/Layout'
import RaiseTicketForm from '../../components/user/RaiseTicketForm'

export default function RaiseTicket() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Raise New Ticket</h1>
            <p className="mt-2 text-gray-600">Fill in the details below to create a new support ticket.</p>
          </div>
          
          <RaiseTicketForm />
        </div>
      </div>
    </Layout>
  )
}
