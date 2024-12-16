import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Box from "../Box";
import IconButton from "../buttons/IconButton";
import { Chip } from "../Chip";
import Hidden from "../hidden/Hidden";
import Icon from "../icon/Icon";
import TableRow from "../TableRow";
import Typography, { H5, Small } from "../Typography";

export interface OrderRowProps {
  orderData: {
    id: string;
    status: string;
    createdAt: string;
    buyerCurrency: string;
    totalBuyerPrice: number;
    sellerCurrency: string;
    totalSellerPrice: number;
  };
}

const getColor = (status: string): string => {
  switch (status) {
    case "Pending":
      return "secondary";
    case "Processing":
      return "secondary";
    case "Delivered":
      return "success";
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
};

const OrderRow: React.FC<OrderRowProps> = ({ orderData }) => {
  return (
    <Link to={`/orders/${orderData.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <TableRow my="1rem" padding="6px 18px">
        <H5 m="6px" textAlign="left">
          {orderData.id}
        </H5>
        <Box m="6px">
          <Chip p="0.25rem 1rem" bg={`${getColor(orderData.status)}.light`}>
            <Small color={`${getColor(orderData.status)}.main`}>{orderData.status}</Small>
          </Chip>
        </Box>
        <Typography className="flex-grow pre" m="6px" textAlign="left">
          {format(new Date(orderData.createdAt), "MMM dd, yyyy")}
        </Typography>
        <Typography m="6px" textAlign="left">
          {`${orderData.buyerCurrency} ${orderData.totalBuyerPrice.toFixed(2)}`}
        </Typography>
        <Typography m="6px" textAlign="left">
          {`${orderData.sellerCurrency} ${orderData.totalSellerPrice.toFixed(2)}`}
        </Typography>
        <Hidden flex="0 0 0 !important" down={769}>
          <Typography textAlign="center" color="text.muted">
            <IconButton size="small">
              <Icon variant="small" defaultcolor="currentColor">
                arrow-right
              </Icon>
            </IconButton>
          </Typography>
        </Hidden>
      </TableRow>
    </Link>
  );
};

export default OrderRow;
