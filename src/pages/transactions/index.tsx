import ZorkLayout from "@components/ZorkLayout";
import ZorkSidebar from "@components/ZorkSidebar";
import ZorkTransaction from "@components/ZorkTransaction";
import { ZorkToggle } from "@components/ZorkToggle";

import { getTransactions } from "@services/Transactions/getTransactions";
import { Transaction } from "@services/Transactions/utils";
import { useUser } from "@services/User/useUser";

import { NextPageWithLayout } from "@pages/utils";

import { useState, useEffect } from "react";

import style from "./style.module.scss";

import Loader from "react-loader-spinner";

const Transactions: NextPageWithLayout = () => {
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [filteredTransactions, setFilteredTransactions] = useState(
    [] as Transaction[]
  );

  const [sentFilter, setSentFilter] = useState(true);
  const [receivedFilter, setReceivedFilter] = useState(true);

  const { access_token, user } = useUser("/login");

  useEffect(() => {
    async function getData() {
      const t = await getTransactions(access_token, { withID: "self" });
      setTransactions(t);
    }

    getData();
  }, [access_token, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const filtered = transactions.filter(
      (transaction) =>
        (transaction.from_id == user.id && sentFilter) ||
        (transaction.to_id == user.id && receivedFilter)
    );

    setFilteredTransactions(filtered);
  }, [transactions, sentFilter, receivedFilter]);

  return (
    <div className={style.container}>
      <header>
        <h1>Your latest Zork transactions</h1>

        <div>
          <ZorkToggle
            text="Sent"
            unchecked={!sentFilter}
            onToggle={(v) => {
              setSentFilter(v);
            }}
          />
          <ZorkToggle
            text="Received"
            unchecked={!receivedFilter}
            onToggle={(v) => {
              setReceivedFilter(v);
            }}
          />
        </div>
      </header>

      <main className={!user ? style.loading : style.transactions}>
        {!user ? (
          <Loader type="Puff" />
        ) : filteredTransactions.length > 0 ? (
          filteredTransactions.map((t) => {
            return (
              <ZorkTransaction key={t.id} transaction={t} viewUser={user} />
            );
          })
        ) : (
          <div className={style.empty}>Nothing here :(</div>
        )}
      </main>
    </div>
  );
};

Transactions.getLayout = (page) => {
  return (
    <ZorkLayout>
      <ZorkSidebar />
      {page}
    </ZorkLayout>
  );
};

export default Transactions;
