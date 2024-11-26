import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Spin, Collapse, Alert } from 'antd';
import taxService from 'services/taxService';
import { getLocalizedText } from '../../../utils/localizationUtils';

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

interface TaxPreviewWidgetProps {
  items: { category: string; price: number }[];
  country: string;
  region?: string;
  currency: string;
}

const TaxPreviewWidget: React.FC<TaxPreviewWidgetProps> = ({ items, country, region, currency }) => {
  const [loading, setLoading] = useState(false);
  const [taxBreakdown, setTaxBreakdown] = useState<
    { category: string; taxRate: number; taxAmount: number }[]
  >([]);
  const [totalTax, setTotalTax] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
      setError(getLocalizedText('Failed to fetch tax data.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <WidgetContainer>
      <h4>{getLocalizedText('Tax Preview')}</h4>
      {loading && <Spin size="small" />}
      {error && <Alert message={error} type="error" />}
      {!loading && !error && (
        <>
          <TaxSummary>
            <span>{getLocalizedText('Estimated Tax')}:</span>
            <TotalTax>
              {totalTax.toFixed(2)} {currency}
            </TotalTax>
          </TaxSummary>
          <Collapse>
            {taxBreakdown.map((item, index) => (
              <Panel
                header={`${getLocalizedText('Category')}: ${item.category}`}
                key={index}
              >
                <p>
                  {getLocalizedText('Tax Rate')}: {item.taxRate}%
                </p>
                <p>
                  {getLocalizedText('Tax Amount')}: {item.taxAmount.toFixed(2)}{' '}
                  {currency}
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
