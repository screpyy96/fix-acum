import Link from 'next/link';

const Breadcrumbs = ({ paths }) => {
  return (
    <nav className="text-sm breadcrumbs">
      <ol className="list-none p-0 inline-flex">
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;
          const decodedLabel = decodeURIComponent(path.label);
          
          return (
            <li key={path.href || index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {!isLast ? (
                <Link href={path.href} className="text-blue-600 hover:underline">
                  {decodedLabel}
                </Link>
              ) : (
                <span className="text-gray-500">{decodedLabel}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
