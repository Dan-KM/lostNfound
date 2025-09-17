// Type definitions
interface Category {
  name: string;
}

interface Subcategory {
  name: string;
}

interface Item {
  name: string;
  description: string;
  category: Category;
  subcategory: Subcategory;
  location: string;
}

interface UserItem {
  id: number;
  serial_id: string;
  item: Item;
  status: string;
  reported_date: string;
}

// Shadcn/UI Table Components with TypeScript
interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ children, ...props }) => (
  <table className="w-full caption-bottom text-sm" {...props}>
    {children}
  </table>
);

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children, ...props }) => (
  <thead className="[&_tr]:border-b" {...props}>
    {children}
  </thead>
);

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableBody: React.FC<TableBodyProps> = ({ children, ...props }) => (
  <tbody className="[&_tr:last-child]:border-0" {...props}>
    {children}
  </tbody>
);

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

const TableRow: React.FC<TableRowProps> = ({ children, ...props }) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" {...props}>
    {children}
  </tr>
);

interface TableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const TableHead: React.FC<TableHeadProps> = ({ children, ...props }) => (
  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0" {...props}>
    {children}
  </th>
);

interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const TableCell: React.FC<TableCellProps> = ({ children, ...props }) => (
  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0" {...props}>
    {children}
  </td>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline";
  size?: "default" | "sm";
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "", 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground border-slate-200 hover:bg-slate-50",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface ResponsiveShadcnTableProps {
  userItems?: UserItem[];
  handleDeleteItem: (id: number) => Promise<void>;
  canDelete: (reportedDate: string) => boolean;
}

export const ResponsiveShadcnTable: React.FC<ResponsiveShadcnTableProps> = ({ 
  userItems: propUserItems = [],
  handleDeleteItem,
  canDelete
}) => {
  
  // Show message when no items match filters
  if (propUserItems.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No items found matching your search criteria.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile view - Card layout */}
      <div className="md:hidden space-y-4">
        {propUserItems.map((item: UserItem) => (
          <div key={item.id} className="bg-white border rounded-lg p-4 shadow-sm border-slate-200">
            <div className="flex justify-between items-start mb-2">
              <div className="font-mono text-sm text-slate-600">{item.serial_id}</div>
              <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                item.status === 'Found' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {item.status || "Pending"}
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">{item.item.name}</h3>
            <p className="text-slate-600 mb-3">{item.item.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="font-medium text-slate-700">Category:</span>
                <br />
                <span className="text-slate-600">{item.item.category.name}</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Subcategory:</span>
                <br />
                <span className="text-slate-600">{item.item.subcategory.name}</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Location:</span>
                <br />
                <span className="text-slate-600">{item.item.location}</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Reported:</span>
                <br />
                <span className="text-slate-600">{new Date(item.reported_date).toLocaleDateString()}</span>
              </div>
            </div>
            <Button 
              onClick={() => handleDeleteItem(item.id)}
              className="w-full"
              size="sm"
              variant="outline"
              disabled={!canDelete(item.reported_date)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>

      {/* Desktop view - Table layout */}
      <div className="hidden md:block">
        <div className="rounded-md border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Serial ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden lg:table-cell">Description</TableHead>
                  <TableHead className="hidden xl:table-cell">Category</TableHead>
                  <TableHead className="hidden xl:table-cell">Subcategory</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Reported</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propUserItems.map((item: UserItem) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-slate-600">{item.serial_id}</TableCell>
                    <TableCell className="font-medium">{item.item.name}</TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-600">{item.item.description}</TableCell>
                    <TableCell className="hidden xl:table-cell">{item.item.category.name}</TableCell>
                    <TableCell className="hidden xl:table-cell">{item.item.subcategory.name}</TableCell>
                    <TableCell className="hidden lg:table-cell">{item.item.location}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Found' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status || "Pending"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-600">
                      {new Date(item.reported_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button 
                        onClick={() => handleDeleteItem(item.id)}
                        size="sm"
                        variant="outline"
                        disabled={!canDelete(item.reported_date)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
