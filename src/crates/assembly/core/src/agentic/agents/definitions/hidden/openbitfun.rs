use crate::agentic::agents::{Agent, UserContextPolicy};
use async_trait::async_trait;

pub struct StarMateAgent;

#[async_trait]
impl Agent for StarMateAgent {
    fn as_any(&self) -> &dyn std::any::Any {
        self
    }
    fn id(&self) -> &str {
        "OpenBitFun"
    }
    fn name(&self) -> &str {
        "OpenBitFun"
    }
    fn description(&self) -> &str {
        "The persistent OpenBitFun product-control assistant"
    }
    fn prompt_template_name(&self, _model_name: Option<&str>) -> &str {
        "openbitfun_agent"
    }
    fn default_tools(&self) -> Vec<String> {
        vec![
            "OpenBitFunControl".into(),
            "GetToolSpec".into(),
            "AskUserQuestion".into(),
        ]
    }
    fn user_context_policy(&self) -> UserContextPolicy {
        UserContextPolicy::empty()
    }
    fn is_readonly(&self) -> bool {
        false
    }
}
