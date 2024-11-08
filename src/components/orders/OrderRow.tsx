import { format } from "date-fns";
import { Link, useLocation } from "react-router-dom";
import React from "react";
import Box from "../Box";
import IconButton from "../buttons/IconButton";
import { Chip } from "../Chip";
import Hidden from "../hidden/Hidden";
import Icon from "../icon/Icon";
import TableRow from "../TableRow";
import Typography, { H5, Small } from "../Typography";

export interface OrderRowProps {
  orderData: {
    orderNo: any;
    status: string;
    href: string;
    purchaseDate: string | Date;
    price: number;
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
      return "";
  }
};

const OrderRow: React.FC<OrderRowProps> = ({ orderData }) => {
  return (
    <Link to={orderData.href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <TableRow my="1rem" padding="6px 18px">
        <H5 m="6px" textAlign="left">
          {orderData.orderNo}
        </H5>
        <Box m="6px">
          <Chip p="0.25rem 1rem" bg={`${getColor(orderData.status)}.light`}>
            <Small color={`${getColor(orderData.status)}.main`}>
              {orderData.status}
            </Small>
          </Chip>
        </Box>
        <Typography className="flex-grow pre" m="6px" textAlign="left">
          {format(new Date(orderData.purchaseDate), "MMM dd, yyyy")}
        </Typography>
        <Typography m="6px" textAlign="left">
          ${orderData.price.toFixed(2)}
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
