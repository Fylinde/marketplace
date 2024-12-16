import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Spin, Collapse, Alert } from 'antd';
import taxService from 'services/taxService';
import { getLocalizedText, formatCurrency } from '../../../../utils/localizationUtils';

const { Panel } = Collapse;

const WidgetContainer = styled.div`
  padding: 15px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  margin-bottom: 20px;
`;

const TaxSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const TotalTax = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

// Props Interface
interface TaxPreviewWidgetProps {
  items: { category: string; price: number }[]; // Array of items with category and price
  country: string; // Country for tax calculation
  region?: string; // Optional region for more specific tax rules
  currency: string; // Currency for formatting tax amounts
}

const TaxPreviewWidget: React.FC<TaxPreviewWidgetProps> = ({ items, country, region, currency }) => {
  const [loading, setLoading] = useState(false);
  const [taxBreakdown, setTaxBreakdown] = useState<
    { category: string; taxRate: number; taxAmount: number }[]
  >([]);
  const [totalTax, setTotalTax] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch tax data whenever relevant dependencies change
  useEffect(() => {
    fetchTaxData();
  }, [items, country, region]);

  const fetchTaxData = async () => {
    setLoading(true);
    setError(null);

    try {
      const responses = await Promise.all(
        items.map((item) =>
          taxService.calculateTax({
            price: item.price,
            category: item.category,
            country,
            region,
          })
        )
      );

      const breakdown = responses.map((response, index) => ({
        category: items[index].category,
        taxRate: response.taxRate,
        taxAmount: response.taxAmount,
      }));

      setTaxBreakdown(breakdown);
      setTotalTax(breakdown.reduce((sum, item) => sum + item.taxAmount, 0));
    } catch (err) {
      setError(getLocalizedText("Failed to fetch tax data", "refundAutomation"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <WidgetContainer>
      <h4>{getLocalizedText("Tax Preview", "refundAutomation")}</h4>
      {loading && <Spin size="small" />}
      {error && <Alert message={error} type="error" />}
      {!loading && !error && (
        <>
          <TaxSummary>
            <span>{getLocalizedText("Estimated Tax", "refundAutomation")}:</span>
            <TotalTax>{formatCurrency(totalTax, currency)}</TotalTax>
          </TaxSummary>
          <Collapse>
            {taxBreakdown.map((item, index) => (
              <Panel
                header={`${getLocalizedText("Category", "refundAutomation")}: ${item.category}`}
                key={index}
              >
                <p>
                  {getLocalizedText("Tax Rate", "refundAutomation")}: {item.taxRate}%
                </p>
                <p>
                  {getLocalizedText("Tax Amount", "refundAutomation")}:{" "}
                  {formatCurrency(item.taxAmount, currency)}
                </p>
              </Panel>
            ))}
          </Collapse>
        </>
      )}
    </WidgetContainer>
  );
};

export default TaxPreviewWidget;