import Layout from '../../components/layout/Layout'
import CreateUserForm from '../../components/admin/CreateUserForm'

export default function CreateUser() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New User</h1>
            <p className="mt-2 text-gray-600">Add a new user to the ticket system.</p>
          </div>
          
          <CreateUserForm />
        </div>
      </div>
    </Layout>
  )
}
