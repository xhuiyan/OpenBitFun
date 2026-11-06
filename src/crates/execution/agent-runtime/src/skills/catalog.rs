#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub(super) enum BuiltinSkillGroup {
    Office,
    Finance,
    Meta,
    MiniApp,
    Creation,
    ComputerUse,
    Canvas,
    Debugging,
    Coordination,
    Planning,
}

impl BuiltinSkillGroup {
    fn as_str(self) -> &'static str {
        match self {
            Self::Office => "office",
            Self::Finance => "finance",
            Self::Meta => "meta",
            Self::MiniApp => "miniapp",
            Self::Creation => "creation",
            Self::ComputerUse => "computer-use",
            Self::Canvas => "canvas",
            Self::Debugging => "debugging",
            Self::Coordination => "coordination",
            Self::Planning => "planning",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(super) struct BuiltinSkillSpec {
    pub(super) dir_name: &'static str,
    pub(super) group: BuiltinSkillGroup,
}

pub(super) const BUILTIN_SKILL_SPECS: &[BuiltinSkillSpec] = &[
    BuiltinSkillSpec {
        dir_name: "agent-browser",
        group: BuiltinSkillGroup::ComputerUse,
    },
    BuiltinSkillSpec {
        dir_name: "agent-eval-canvas",
        group: BuiltinSkillGroup::Canvas,
    },
    BuiltinSkillSpec {
        dir_name: "docs-canvas",
        group: BuiltinSkillGroup::Canvas,
    },
    BuiltinSkillSpec {
        dir_name: "starmate-canvas",
        group: BuiltinSkillGroup::Canvas,
    },
    BuiltinSkillSpec {
        dir_name: "create-agent",
        group: BuiltinSkillGroup::Meta,
    },
    BuiltinSkillSpec {
        dir_name: "create-starmate-skin",
        group: BuiltinSkillGroup::Meta,
    },
    BuiltinSkillSpec {
        dir_name: "commit-push-pr",
        group: BuiltinSkillGroup::Meta,
    },
    BuiltinSkillSpec {
        dir_name: "find-skills",
        group: BuiltinSkillGroup::Meta,
    },
    BuiltinSkillSpec {
        dir_name: "debug",
        group: BuiltinSkillGroup::Debugging,
    },
    BuiltinSkillSpec {
        dir_name: "multitask",
        group: BuiltinSkillGroup::Coordination,
    },
    BuiltinSkillSpec {
        dir_name: "plan",
        group: BuiltinSkillGroup::Planning,
    },
    BuiltinSkillSpec {
        dir_name: "miniapp-dev",
        group: BuiltinSkillGroup::MiniApp,
    },
    BuiltinSkillSpec {
        dir_name: "openbitfun-frontend-dev",
        group: BuiltinSkillGroup::Creation,
    },
    BuiltinSkillSpec {
        dir_name: "generate-image",
        group: BuiltinSkillGroup::Creation,
    },
    BuiltinSkillSpec {
        dir_name: "ppt-design",
        group: BuiltinSkillGroup::Office,
    },
    BuiltinSkillSpec {
        dir_name: "china-audit-xls",
        group: BuiltinSkillGroup::Finance,
    },
    BuiltinSkillSpec {
        dir_name: "china-break-trace",
        group: BuiltinSkillGroup::Finance,
    },
    BuiltinSkillSpec {
        dir_name: "china-client-report",
        group: BuiltinSkillGroup::Finance,
    },
    BuiltinSkillSpec {
        dir_name: "china-dd-checklist",
        group: BuiltinSkillGroup::Finance,
    },
    BuiltinSkillSpec {
        dir_name: "china-deal-tracker",
        group: BuiltinSkillGroup::Finance,
    },
    BuiltinSkillSpec {
        dir_name: "china-earnings-analysis",
        group: BuiltinSkillGroup::Finance,
    },
    BuiltinSkillSpec {
        dir_name: "china-earnings-preview",
        group: BuiltinSkillGroup::Finance,
    },
    BuiltinSkillSpec {
        dir_name: "china-kyc-rules",
        group: BuiltinSkillGroup::Finance,
    },
    BuiltinSkillSpec {
        dir_name: "china-ppt-template-creator",
        group: BuiltinSkillGroup::Finance,
    },
    BuiltinSkillSpec {
        dir_name: "pr-review-canvas",
        group: BuiltinSkillGroup::Canvas,
    },
    BuiltinSkillSpec {
        dir_name: "writing-skills",
        group: BuiltinSkillGroup::Meta,
    },
];

pub(super) fn builtin_skill_spec(dir_name: &str) -> Option<&'static BuiltinSkillSpec> {
    BUILTIN_SKILL_SPECS
        .iter()
        .find(|spec| spec.dir_name == dir_name)
}

fn builtin_skill_group(dir_name: &str) -> Option<BuiltinSkillGroup> {
    builtin_skill_spec(dir_name).map(|spec| spec.group)
}

pub fn builtin_skill_group_key(dir_name: &str) -> Option<&'static str> {
    builtin_skill_group(dir_name).map(BuiltinSkillGroup::as_str)
}
