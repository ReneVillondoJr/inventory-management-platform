const logs = [
  {
    id: 'ACT-1048',
    user: 'Aisha Ali',
    action: 'Updated product pricing',
    module: 'Products',
    time: '2 min ago',
  },
  {
    id: 'ACT-1047',
    user: 'Marcus Lee',
    action: 'Created warehouse transfer',
    module: 'Operations',
    time: '18 min ago',
  },
  {
    id: 'ACT-1046',
    user: 'Priya Shah',
    action: 'Approved purchase order',
    module: 'Purchasing',
    time: '1 hour ago',
  },
  {
    id: 'ACT-1045',
    user: 'John Carter',
    action: 'Exported sales report',
    module: 'Reports',
    time: '2 hours ago',
  },
];

export default function ActivityLogsPage() {
  return (
    <div className='space-y-6'>
      <div className='rounded-xl border bg-card p-4 shadow-sm'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Activity logs
            </h1>
            <p className='text-sm text-muted-foreground'>
              Recent system activity across all modules.
            </p>
          </div>

          <button className='rounded-lg border bg-background px-3 py-2 text-sm font-medium'>
            Export log
          </button>
        </div>
      </div>

      <div className='rounded-xl border bg-card shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-left text-sm'>
            <thead className='border-b bg-muted/40 text-muted-foreground'>
              <tr>
                <th className='px-4 py-3 font-medium'>ID</th>
                <th className='px-4 py-3 font-medium'>User</th>
                <th className='px-4 py-3 font-medium'>Action</th>
                <th className='px-4 py-3 font-medium'>Module</th>
                <th className='px-4 py-3 font-medium'>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className='border-b last:border-0'>
                  <td className='px-4 py-3 font-medium'>{log.id}</td>
                  <td className='px-4 py-3'>{log.user}</td>
                  <td className='px-4 py-3'>{log.action}</td>
                  <td className='px-4 py-3'>
                    <span className='rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700'>
                      {log.module}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-muted-foreground'>
                    {log.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
