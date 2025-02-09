
import IconButton from "../../components/buttons/IconButton";
import { Chip } from "../../components/Chip";
import FlexBox from "../../components/FlexBox";
import Hidden from "../../components/hidden/Hidden";
import Icon from "../../components/icon/Icon";
import CustomerDashboardLayout from "../../components/layout/CustomerDashboardLayout";
import DashboardPageHeader from "../../components/layout/DashboardPageHeader";
import Pagination from "../../components/pagination/Pagination";
import TableRow from "../../components/TableRow";
import Typography, { SemiSpan, Small } from "../../components/Typography";
import { format } from "date-fns";
import { Link } from "react-router-dom"; 
import React from "react";

const TicketList = () => {
  return (
    <div>
      <DashboardPageHeader title="Support Ticket" iconName="support" />

      {[1, 2, 3].map((item) => (
        <Link to="/support-tickets/xkssThds6h37sd" key={item}>
          <TableRow my="1rem" padding="15px 24px">
            <div>
              <span>My product is broken. I need refund</span>
              <FlexBox alignItems="center" flexWrap="wrap" pt="0.5rem" m="-6px">
                <Chip p="0.25rem 1rem" bg="primary.light" m="6px">
                  <Small color="primary.main">Urgent</Small>
                </Chip>
                <Chip p="0.25rem 1rem" bg="success.light" m="6px">
                  <Small color="success.main">Open</Small>
                </Chip>
                <SemiSpan className="pre" m="6px">
                  {format(new Date("2020/10/12"), "MMM dd, yyyy")}
                </SemiSpan>
                <SemiSpan m="6px">Website Problem</SemiSpan>
              </FlexBox>
            </div>

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

TicketList.layout = CustomerDashboardLayout;

export default TicketList;
