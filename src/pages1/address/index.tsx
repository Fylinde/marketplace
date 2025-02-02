
import Button from "../../components/buttons/Button";
import IconButton from "../../components/buttons/IconButton";
import FlexBox from "../../components/FlexBox";
import Icon from "../../components/icon/Icon";
import CustomerDashboardLayout from "../../components/layout/CustomerDashboardLayout";
import DashboardPageHeader from "../../components/layout/DashboardPageHeader";
import Pagination from "../../components/pagination/Pagination";
import TableRow from "../../components/TableRow";
import Typography from "../../components/Typography";
import { Link } from "react-router-dom";
import React from "react";

const AddressList = () => {
  return (
    <div>
      <DashboardPageHeader
        title="My Addresses"
        iconName="pin_filled"
        button={
          <Button color="primary" bg="primary.light" px="2rem">
            Add New Address
          </Button>
        }
      />

      {orderList.map(() => (
        <TableRow my="1rem" padding="6px 18px">
          <Typography className="pre" m="6px" textAlign="left">
            Ralf Edward
          </Typography>
          <Typography flex="1 1 260px !important" m="6px" textAlign="left">
            777 Brockton Avenue, Abington MA 2351
          </Typography>
          <Typography className="pre" m="6px" textAlign="left">
            +1927987987498
          </Typography>

          <Typography className="pre" textAlign="center" color="text.muted">
            <Link to="/address/xkssThds6h37sd">
              <Typography as="a" href="/address/xkssThds6h37sd" color="inherit">
                <IconButton size="small">
                  <Icon variant="small" defaultcolor="currentColor">
                    edit
                  </Icon>
                </IconButton>
              </Typography>
            </Link>
            <IconButton size="small" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <Icon variant="small" defaultcolor="currentColor">
                delete
              </Icon>
            </IconButton>

          </Typography>
        </TableRow>
      ))}

      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination
          pageCount={5}
          onChange={(data) => {
            console.log(data.selected);
          }}
        />
      </FlexBox>
    </div>
  );
};

const orderList = [
  {
    orderNo: "1050017AS",
    status: "Pending",
    purchaseDate: new Date(),
    price: 350,
  },
  {
    orderNo: "1050017AS",
    status: "Processing",
    purchaseDate: new Date(),
    price: 500,
  },
  {
    orderNo: "1050017AS",
    status: "Delivered",
    purchaseDate: "2020/12/23",
    price: 700,
  },
  {
    orderNo: "1050017AS",
    status: "Delivered",
    purchaseDate: "2020/12/23",
    price: 700,
  },
  {
    orderNo: "1050017AS",
    status: "Cancelled",
    purchaseDate: "2020/12/15",
    price: 300,
  },
];

AddressList.layout = CustomerDashboardLayout;

export default AddressList;
