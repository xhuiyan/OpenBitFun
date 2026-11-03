package com.openbitfun.mobile.core.feature.session

import kotlin.test.Test
import kotlin.test.assertEquals

class ConversationHeaderPresentationTest {
    @Test
    fun aNamedDesktopIsTheAnswerEvenWhenABranchIsKnown() {
        assertEquals(
            "Studio",
            ConversationHeaderPresenter.contextTitle(desktopName = "Studio", workspaceBranch = "main"),
        )
    }

    @Test
    fun withoutADesktopTheBranchIsShownBesideTheBrand() {
        assertEquals(
            "StarMate · feat/chat",
            ConversationHeaderPresenter.contextTitle(desktopName = "", workspaceBranch = "feat/chat"),
        )
    }

    @Test
    fun blankIsNotAName() {
        assertEquals(
            "StarMate",
            ConversationHeaderPresenter.contextTitle(desktopName = "  ", workspaceBranch = "\n"),
        )
    }
}
