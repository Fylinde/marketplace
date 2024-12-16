import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input, Collapse, Spin, Alert } from "antd";
import styled from "styled-components";
import { fetchKnowledgeBaseArticles, selectKnowledgeBase } from "../../../redux/slices/support/supportSlice";
import { getLocalizedText } from "utils/localizationUtils";
import type { AppDispatch, RootState } from "../../../redux/store";
import { KnowledgeBaseArticle } from "@/redux/slices/support/supportSlice";



const KnowledgeBaseContainer = styled.div`
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    font-size: 1.8rem;
  }

  .search-bar {
    margin-bottom: 20px;
  }
`;

interface KnowledgeBaseProps {
  knowledgeBase: KnowledgeBaseArticle[];
  loading: boolean;
  error: string | null;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ knowledgeBase, loading, error }) => {
  const dispatch = useDispatch<AppDispatch>();
  // const { knowledgeBase, loading, error } = useSelector(selectKnowledgeBase);

  useEffect(() => {
    dispatch(fetchKnowledgeBaseArticles());
  }, [dispatch]);

  return (
    <KnowledgeBaseContainer>
      <h2>{getLocalizedText("Knowledge Base", "support")}</h2>
      <Input.Search
        placeholder={getLocalizedText("Search articles", "support")}
        className="search-bar"
      />

      {loading && <Spin tip={getLocalizedText("Loading articles...", "support")} />}
      {error && <Alert message={error} type="error" />}

      <Collapse>
        {knowledgeBase.map((article: any) => (
          <Collapse.Panel header={article.title} key={article.id}>
            {article.content}
          </Collapse.Panel>
        ))}
      </Collapse>
    </KnowledgeBaseContainer>
  );
};

export default KnowledgeBase;
