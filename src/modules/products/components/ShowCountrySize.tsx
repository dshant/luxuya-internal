import { Container, Heading } from "@medusajs/ui";
import { TranslatedText } from "@modules/common/components/translation/translated-text";

interface ShowCountrySizeProps {
  sizeChart: Map<string, any>;
}

export const ShowCountrySize = ({ sizeChart }: ShowCountrySizeProps) => {
  const countries = Array.from(sizeChart.keys());
  const maxRows = Math.max(...countries.map(country => sizeChart.get(country)?.length || 0));

  return (
    <div>
      {/* <Heading level="h1" className="text-2xl font-bold mb-4 text-center">Size Conversion Table</Heading> */}
      <div className="overflow-x-auto shadow-lg rounded-lg max-h-[400px] overflow-y-auto">
        <table className="w-full min-w-max border-collapse border border-gray-300 bg-white">
          <thead className="bg-gray-800 text-white sticky top-0 z-10">
            <tr>
              {countries.map((country) => (
                <th key={country} className="px-4 py-2 text-lg border border-gray-400">
                  <TranslatedText text={country} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows }).map((_, index) => (
              <tr
                key={index}
                className={`transition-all hover:bg-gray-200 ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                }`}
              >
                {countries.map((country) => (
                  <td key={country} className="px-4 py-2 text-center border border-gray-300">
                    {sizeChart.get(country)?.[index] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
