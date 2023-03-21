interface CustomTableProps extends ReactProps {
  titles: [];
  data: any;
  thClassName: string;
  tdClassName: string;
}

export function CustomTable({
  titles,
  data,
  thClassName = "p-2 border border-slate-400 text-center",
  tdClassName = "p-2 border border-gray-400 text-center",
  ...props
}: CustomTableProps) {
  return (
    <div className="">WIP</div>
    // <table className="w-full mt-2 text-sm border-collapse table-fixed">
    //   <thead className="font-semibold bg-slate-300">
    //     <tr>
    //       {titles.map((title, index) => (
    //         <th key={index} className={thClassName}>
    //           {title}
    //         </th>
    //       ))}
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {data.map((item, index ) => (
    //       <tr key={index}>
    //         <td className={}
    //       </tr>
    //     ))}
    //   </tbody>
    // </table>
  );
}
