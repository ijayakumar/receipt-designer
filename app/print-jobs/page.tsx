import PrintJobs from "@/components/PrintJobs"
import PermissionGuard from "@/app/components/PermissionGuard";

export default function PrintJobsPage() {
  return (
    <div className="container mx-auto p-4">
        <PermissionGuard requiredPermission="print_jobs">
      <h1 className="text-2xl font-bold mb-4">Print Jobs</h1>
      <PrintJobs />
        </PermissionGuard>
    </div>
  )
}

