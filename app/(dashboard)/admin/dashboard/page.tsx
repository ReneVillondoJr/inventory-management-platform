const stats = [
  { label: 'Inventory value', value: '$184,250', change: '+12.4%' },
  { label: 'Low stock items', value: '24', change: '-3 this week' },
  { label: 'Orders today', value: '68', change: '+9.2%' },
  { label: 'Fulfillment rate', value: '96.8%', change: '+1.4%' },
];

const sales = [
  { name: 'Mon', value: 42 },
  { name: 'Tue', value: 58 },
  { name: 'Wed', value: 49 },
  { name: 'Thu', value: 74 },
  { name: 'Fri', value: 88 },
  { name: 'Sat', value: 67 },
  { name: 'Sun', value: 81 },
];

const recentOrders = [
  {
    id: 'PO-1045',
    customer: 'Northwind Retail',
    total: '$2,480',
    status: 'In transit',
  },
  {
    id: 'SO-2208',
    customer: 'BluePeak Foods',
    total: '$1,120',
    status: 'Packed',
  },
  {
    id: 'PO-1042',
    customer: 'Harbor Supply',
    total: '$3,180',
    status: 'Received',
  },
  {
    id: 'SO-2205',
    customer: 'Meridian Mart',
    total: '$890',
    status: 'Processing',
  },
];

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className='rounded-xl border bg-card p-4 shadow-sm'
          >
            <p className='text-sm text-muted-foreground'>{stat.label}</p>
            <div className='mt-3 flex items-end justify-between gap-3'>
              <h3 className='text-2xl font-semibold tracking-tight'>
                {stat.value}
              </h3>
              <span className='text-xs font-medium text-emerald-600'>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className='grid gap-6 lg:grid-cols-[1.5fr_0.9fr]'>
        <div className='rounded-xl border bg-card p-4 shadow-sm'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Sales overview</h2>
            <span className='text-sm text-muted-foreground'>Last 7 days</span>
          </div>

          <div className='flex h-52 items-end gap-3'>
            {sales.map((item) => (
              <div
                key={item.name}
                className='flex flex-1 flex-col items-center gap-2'
              >
                <div
                  className='w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-300'
                  style={{ height: `${item.value}%` }}
                />
                <span className='text-xs text-muted-foreground'>
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-xl border bg-card p-4 shadow-sm'>
          <h2 className='text-lg font-semibold'>Quick summary</h2>
          <div className='mt-4 space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Warehouse health</p>
              <p className='mt-1 text-xl font-semibold'>92%</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Open returns</p>
              <p className='mt-1 text-xl font-semibold'>17</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Pending approvals</p>
              <p className='mt-1 text-xl font-semibold'>6</p>
            </div>
          </div>
        </div>
      </section>

      <section className='rounded-xl border bg-card p-4 shadow-sm'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Recent orders</h2>
          <button className='text-sm font-medium text-primary'>View all</button>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full text-left text-sm'>
            <thead className='border-b text-muted-foreground'>
              <tr>
                <th className='pb-3 font-medium'>Order</th>
                <th className='pb-3 font-medium'>Customer</th>
                <th className='pb-3 font-medium'>Total</th>
                <th className='pb-3 font-medium'>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className='border-b last:border-0'>
                  <td className='py-3 font-medium'>{order.id}</td>
                  <td className='py-3'>{order.customer}</td>
                  <td className='py-3'>{order.total}</td>
                  <td className='py-3'>
                    <span className='rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700'>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
